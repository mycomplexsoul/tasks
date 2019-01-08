import { iEntity } from "../crosscommon/iEntity";
import { Catalog } from "../crosscommon/entities/Catalog";
import { FieldDefinition } from "../crosscommon/FieldDefinition";
import { MoGen } from "../crosscommon/MoGen";
import { DateUtils } from "../crosscommon/DateUtility";
import { Utils } from "../crosscommon/Utility";

export class MoSQL {
    model: iEntity = null;
    constants: any = {
        _null: 'null'
        , _integer: 'integer'
        , _long: 'long'
        , _double: 'double'
        , _date: 'date'
        , _datetime: 'datetime'
        , _datetimeFormatDB: 'yyyy-MM-dd HH:mm:ss'
        , _s: ', '
        , _and: ' and '
        , _or: ' or '
    };
    OPERATORS: any = {
        eq: '='
        , ne: '!='
        , in: 'in'
        , lt: '<'
        , ge: '>='
    };
    
    constructor(model?: iEntity){
        this.model = model;
    }

    decideModel(model: iEntity){
        if (model) {
            // use model
            return model;
        } else {
            // use internal model
            if (!this.model) {
                throw new Error('Model is null');
            }
            return this.model;
        }
    }

    concatAnd(sql: string, str: string) {
        return MoGen.concat(sql, this.constants._and) + str;
    }

    concatOr(sql: string, str: string) {
        return MoGen.concat(sql, this.constants._or) + str;
    }

    concatSemicolon(sql: string, str: string) {
        return MoGen.concat(sql, this.constants._s) + str;
    }

    // get PK fields
    getPK(model: iEntity){
        return model.metadata.fields.filter(e => {
            return e.isPK;
        });
    };

    formatValueForSQL(dbType: string, value: string | number | Date | null, dbName: string = '', operator: string = '='): string {
        let sql: string = '';
        const c = { ...this.constants };
        const prefix = dbName ? `${dbName} ${operator} ` : '';

        if (operator === 'in'){
            sql = `${prefix}(${value})`;
            return sql;
        }

        if (value === null){
            sql = `${prefix}null`;
        } else if ([c._integer, c._long, c._double].indexOf(dbType) !== -1){
            sql = `${prefix}${value}`;
        } else if (dbType === c._date && typeof value !== 'number'){
            sql = `${prefix}'${DateUtils.formatDate(value)}'`;
        } else if (dbType === c._datetime && typeof value !== 'number'){
            sql = `${prefix}'${DateUtils.formatDate(value, c._datetimeFormatDB)}'`;
        } else {
            sql = `${prefix}'${Utils.parseSimpleQuoteForSQL(String(value))}'`;
        }
        return sql;
    }

    isValidFieldName(model: iEntity, dbName: string, tableFieldsOnly: boolean): boolean {
        let found: boolean;
        if (tableFieldsOnly) {
            found = !!model.metadata.fields.find(f => f.dbName === dbName && f.isTableField);
        } else {
            found = !!model.metadata.fields.find(f => f.dbName === dbName);
        }
        return found;
    }

    datesAreEqual(date1: string | Date, date2: string | Date): boolean {
        let d1: Date = typeof date1 === 'string' ? new Date(date1) : date1;
        let d2: Date = typeof date2 === 'string' ? new Date(date2) : date2;
        
        return d1.getTime() === d2.getTime();
    }

    toInsertSQL(model?: iEntity): string {
        const m: iEntity = this.decideModel(model);
        let sql: string = '', headers = '';
        const c = { ...this.constants };

        m.metadata.fields.filter(f => f.isTableField).forEach(f =>  {
            headers = this.concatSemicolon(headers, f.dbName);
            sql = this.concatSemicolon(sql, this.formatValueForSQL(f.dbType, (m[f.dbName] !== null && m[f.dbName] !== undefined) ? m[f.dbName] : null));
        });

        sql = `insert into ${m.metadata.tableName} (${headers}) values (${sql})`;
        return sql;
    }

    toChangesObject(model: iEntity, changes: iEntity | Array<any>): any[] {
        const m: iEntity = this.decideModel(model);
        const c = { ...this.constants };
        let field: FieldDefinition;
        let changesArray: any[] = [];
        let previousValue: any;
        let newValue: any;
        const recordName: string = m.recordName();
        
        const handlePossibleChange = (dbName: string, dbType: string, previousValue: any, value: any) => {
            let areDifferent: boolean;
            if ([c._date, c._datetime].indexOf(dbType) !== -1){
                if (value === null && previousValue === null) {
                    areDifferent = false;
                }
                if (value === null && previousValue !== null) {
                    areDifferent = true;
                }
                if (value !== null && previousValue === null) {
                    value = new Date(value);
                    areDifferent = true;
                }
                if (value !== null && previousValue !== null) {
                    value = new Date(value);
                    areDifferent = !this.datesAreEqual(previousValue, value);
                }
            } else {
                areDifferent = previousValue !== value;
            }
            if (areDifferent){ // change value diff from current
                changesArray.push({ dbName, dbType, previousValue, value, recordName });
            }
        };

        if (Array.isArray(changes)){
            changes.forEach((ch) => { // { dbName: string, value: any }
                if (this.isValidFieldName(m, ch.dbName, true)){
                    field = m.metadata.fields.filter(e => {
                        return e.dbName === ch.dbName;
                    })[0];
                    previousValue = m[ch.dbName];
                    newValue = ch.value;
                    
                    handlePossibleChange(field.dbName, field.dbType, previousValue, newValue);
                } else {
                    // dbName is not valid, skip it
                }
            });
        }
        if (changes !== null && !Array.isArray(changes)){
            // other object with different values on some members
            changes.metadata.fields.forEach(field => {
                if (!field.isPK && field.isTableField/* && changes.db[dbName]()*/){ // only members that are not PKs can receive changes in this way
                    previousValue = m[field.dbName];
                    newValue = changes[field.dbName];
                    
                    handlePossibleChange(field.dbName, field.dbType, previousValue, newValue);
                }
            });
        }

        console.log(`Changes detection for object, changes detected:`, changesArray);

        return changesArray;
    }

    toUpdateSQL(changes: iEntity | Array<any>, model?: iEntity): string {
        const m: iEntity = this.decideModel(model);
        let sql: string = '';
        
        let sqlChanges = "";
        const pkFields = this.getPK(m);
        
        const changesArray: any[] = this.toChangesObject(m, changes);
        if (!changesArray.length) {
            return null;
        }

        changesArray.forEach((change: any) => { // { dbName, dbType, previousValue, value }
            // as a special case, if a change is detected on _date_add field, skip that field for sql
            //if (change.dbName !== `${model.metadata.prefix}_date_add`){
            sqlChanges = this.concatSemicolon(sqlChanges, this.formatValueForSQL(change.dbType, change.value, change.dbName));
            //}
        });

        // iterate PKs
        pkFields.forEach((f) => {
            sql = this.concatAnd(sql, this.formatValueForSQL(f.dbType, m[f.dbName], f.dbName));
        });

        sql = `update ${m.metadata.tableName} set ${sqlChanges} where ${sql}`;
        return sql;
    }

    toDeleteSQL(model?: iEntity): string {
        const m: iEntity = this.decideModel(model);
        let sql: string = '';
        const c = { ...this.constants };

        this.getPK(m).forEach(f =>  {
            sql = this.concatAnd(sql, this.formatValueForSQL(f.dbType, m[f.dbName]));
        });

        sql = `delete from ${m.metadata.tableName} where (${sql})`;
        return sql;
    }

    toSelectPKSQL = (model?: iEntity): string => {
        const m: iEntity = this.decideModel(model);
        let sql: string = '';
        
        this.getPK(m).forEach(field => {
            sql = this.concatAnd(sql, this.formatValueForSQL(field.dbType, m[field.dbName], field.dbName));
        });
        
        sql = `select * from ${m.metadata.viewName}${sql ? ` where ${sql}` : ''}`;
        return sql;
    }

    toSelectPKPlaceholderSQL = (model?: iEntity): string => {
        const m: iEntity = this.decideModel(model);
        let sql: string = '';
        
        this.getPK(m).forEach((field, index: number) => {
            sql = this.concatAnd(sql, this.formatValueForSQL(field.dbType, `{${field.dbName}}`, field.dbName)); // This will not work if dbType is Date, if a PK is Date fix it
        });

        return sql;
    }

    toSelectSQL = (criteria?: any, model?: iEntity): string => {
        const m: iEntity = this.decideModel(model);
        let sql: string = '';

        console.log('raw criteria', criteria);
        if (criteria){
            console.log('parse criteria', this.parseSQLCriteria(criteria));
            sql = this.criteriaToSQL(this.parseSQLCriteria(criteria), m);
            console.log('sql criteria', sql);
        }

        sql = `select * from ${m.metadata.viewName}${sql ? ` where ${sql}` : ''}`;
        return sql;
    }

    parseSQLCriteria = (criteria: any): string => {
        const jsonCriteria: any = JSON.parse(decodeURIComponent(criteria));
        return jsonCriteria;
    }

    criteriaToSQL = (criteria: any, model: iEntity): string => {
        let sql: string = '';

        criteria.cont.forEach((crit: any) => {
            if (Array.isArray(crit.cont)) {
                sql = this.criteriaToSQL(crit, model);
            } else {
                let completeFieldName: string = '';
                if (crit.f[0] === '_') { // field name starts with an underscore, append prefix
                    completeFieldName = model.metadata.prefix + crit.f;
                } else {
                    completeFieldName = crit.f;
                }
                if (model.metadata.fields.find(f => f.dbName === completeFieldName)){
                    let dbType: string = model.metadata.fields.find(f => f.dbName === completeFieldName).dbType;
                    if (criteria.gc === 'AND'){
                        sql = this.concatAnd(sql, this.formatValueForSQL(dbType, crit.val, completeFieldName, this.OPERATORS[crit.op]));
                    } else {
                        sql = this.concatOr(sql, this.formatValueForSQL(dbType, crit.val, completeFieldName, this.OPERATORS[crit.op]));
                    }
                } else {
                    // field not found inside this Entity, skip it
                }
            }
        });

        return sql ? `(${sql})` : '';
    }
}
