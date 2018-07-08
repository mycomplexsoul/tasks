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

    concatSemicolon(sql: string, str: string) {
        return MoGen.concat(sql, this.constants._s) + str;
    }

    // get PK fields
    getPK(model: iEntity){
        return model.metadata.fields.filter(e => {
            return e.isPK;
        });
    };

    formatValueForSQL(dbType: string, value: string | number | Date | null, dbName: string = ''): string {
        let sql: string = '';
        const c = { ...this.constants };
        const prefix = dbName ? `${dbName} = ` : '';

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

    isValidFieldName(model: iEntity, dbName: string): boolean {
        let filtered = model.metadata.fields.filter(f => f.dbName === dbName)
        return filtered.length > 0;
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
        
        const handlePossibleChange = (dbName: string, dbType: string, previousValue: any, value: any) => {
            let areDifferent: boolean;
            if ([c._date, c._datetime].indexOf(dbType) !== -1){
                areDifferent = !this.datesAreEqual(previousValue, newValue);
            } else {
                areDifferent = previousValue !== newValue;
            }
            if (areDifferent){ // change value diff from current
                changesArray.push({ dbName, dbType, previousValue, value });
            }
        };

        if (Array.isArray(changes)){
            changes.forEach((ch) => { // { dbName: string, value: any }
                if (this.isValidFieldName(m, ch.dbName)){
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
                if (!field.isPK/* && changes.db[dbName]()*/){ // only members that are not PKs can receive changes in this way
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
        const c = { ...this.constants };
        
        let sqlChanges = "";
        const pkFields = this.getPK(m);
        let field: FieldDefinition;
        
        let changesArray: any[] = this.toChangesObject(m, changes);
        changesArray.forEach((change: any) => { // { dbName, dbType, previousValue, value }
            sqlChanges = this.concatSemicolon(sqlChanges, this.formatValueForSQL(change.dbType, change.value, change.dbName));
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
        let completeFieldName: string = '';

        if (criteria){
            Object.keys(criteria).forEach((fieldName: string) => {
                if (fieldName[0] === '_') { // field name starts with an underscore, append prefix
                    completeFieldName = m.metadata.prefix + fieldName;
                } else {
                    completeFieldName = fieldName;
                }
                if (this.isValidFieldName(m, completeFieldName)){
                    let dbType: string = m.metadata.fields.filter(f => f.dbName === completeFieldName)[0].dbType;
                    sql = this.concatAnd(sql, this.formatValueForSQL(dbType, criteria[fieldName], completeFieldName));
                } else {
                    // field not found inside this Entity, skip it
                }
            });
        }

        sql = `select * from ${m.metadata.viewName}${sql ? ` where ${sql}` : ''}`;
        return sql;
    }
}
