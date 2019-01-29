import * as fs from 'fs';
import { EntityParser } from './EntityParser';
import { EntityDefinition } from '../crosscommon/EntityDefinition';
import { FieldDefinition } from '../crosscommon/FieldDefinition';
import { ViewJoinDefinition } from '../crosscommon/ViewJoinDefinition';

export class MoBasicGenerator {
    entity: EntityDefinition;
    constants: any = {
        tab: '\t'
        , line: '\n'
        , types: {
            integer: 'number'
            , long: 'number'
            , double: 'number'
            , string: 'string'
            , date: 'Date'
            , datetime: 'Date'
        }
    }

    constructor(entityName: string) {
        // read metadata from entity
        let ep: EntityParser = new EntityParser();
        this.entity = ep.parse(entityName);
    }

    saveToFile = (filename: string, contents: string) => {
        fs.writeFile(filename, contents, function(err: any) {
            if (err) {
                return console.log(err);
            }
            console.log(`The file ${filename} was saved!`);
        });
    }

    createTypeFile = (): void => {
        let str = '', temp = '';
        const entityName = this.entity.name;
        const { tab, line, types } = this.constants;

        str += `import { iEntity } from "../iEntity";`;
        str += line + `import { FieldDefinition } from "../FieldDefinition";`;
        str += line + `import { ViewJoinDefinition } from "../ViewJoinDefinition";`;
        str += line + line;
        str += `export class ${entityName} implements iEntity {`;
        let flagForViewFields = true;
        this.entity.fields.forEach(f => {
            if (!f.isTableField && flagForViewFields) {
                flagForViewFields = false;
                str += line;
            }
            str += line + tab + `public ${f.dbName}: ${types[f.dbType]};`;
        });

        // metadata
        str += line;
        str += line + tab + `public metadata: {`;
        const props = [
            'name'
            , 'namespace'
            , 'removeMeans'
            , 'authNeeded'
            , 'displayOnMenu'
            , 'prefix'
            , 'permissionsTemplate'
            , 'tableName'
            , 'viewName'
        ];
        props.forEach((prop: string, index: number) => {
            str += line + tab + tab + (index === 0 ? '' : ', ') + `${prop}: ${typeof this.entity[prop]}`;
        });
        str += line + tab + tab + `, permissions: string[]`;
        str += line + tab + tab + `, specialFeatures: string[]`;
        str += line + tab + tab + `, fields: FieldDefinition[]`;
        str += line + tab + tab + `, view: ViewJoinDefinition[]`;
        str += line + tab + `} = {`;
        props.forEach((prop: string, index: number) => {
            str += line + tab + tab + (index === 0 ? '' : ', ') + `${prop}: ${typeof this.entity[prop] === 'string' ? "'" + this.entity[prop] + "'" : this.entity[prop] }`;
        });
        str += line + tab + tab + `, permissions: [${line + tab + tab + tab}${this.entity.permissions.map(s => "'" + s + "'").join(line + tab + tab + tab + ', ')}${line + tab + tab}]`;
        str += line + tab + tab + `, specialFeatures: [${line + tab + tab + tab}${this.entity.specialFeatures.map(s => "'" + s + "'").join(line + tab + tab + tab + ', ')}${line + tab + tab}]`;
        str += line + tab + tab + `, fields: [`;
        
        this.entity.fields.forEach((f: FieldDefinition, index: number) => {
            str += (index === 0 ? line + tab + tab + tab : ', ') + `{`;
            str += line + tab + tab + tab + tab + `templateId: '${f.templateId}'`;
            str += line + tab + tab + tab + tab + `, dbName: '${f.dbName}'`;
            str += line + tab + tab + tab + tab + `, dbType: '${f.dbType}'`;
            str += line + tab + tab + tab + tab + `, isTableField: ${f.isTableField}`;
            str += line + tab + tab + tab + tab + `, isPK: ${f.isPK}`;
            str += line + tab + tab + tab + tab + `, size: ${f.size}`;
            str += line + tab + tab + tab + tab + `, decimal: ${f.decimal}`;
            str += line + tab + tab + tab + tab + `, minLength: ${f.minLength}`;
            str += line + tab + tab + tab + tab + `, allowNull: ${f.allowNull}`;
            str += line + tab + tab + tab + tab + `, default: '${f.default}'`;
            str += line + tab + tab + tab + tab + `, dbComment: '${f.dbComment}'`;
            str += line + tab + tab + tab + tab + `, catalogId: '${f.catalogId}'`;
            str += line + tab + tab + tab + tab + `, originTable: '${f.originTable}'`;
            str += line + tab + tab + tab + tab + `, linkedField: '${f.linkedField}'`;
            str += line + tab + tab + tab + tab + `, entName: '${f.entName}'`;
            str += line + tab + tab + tab + tab + `, formControl: '${f.formControl}'`;
            str += line + tab + tab + tab + tab + `, captureRequired: ${f.captureRequired}`;
            str += line + tab + tab + tab + tab + `, appearsByDefaultOnGrid: ${f.appearsByDefaultOnGrid}`;
            str += line + tab + tab + tab + tab + `, specialRules: [`;
            if (f.specialRules) {
                f.specialRules.forEach((sp: string, index: number) => {
                    str += line + tab + tab + tab + tab + tab + (index === 0 ? '' : ', ') + `'${sp}'`;
                });
            }
            str += line + tab + tab + tab + tab + `]`;
            str += line + tab + tab + tab + tab + `, displayName: '${f.displayName}'`;
            str += line + tab + tab + tab + tab + `, tooltip: '${f.tooltip}'`;
            str += line + tab + tab + tab + tab + `, isRecordName: ${f.isRecordName}`;
            str += line + tab + tab + tab + tab + `, gridOrder: ${f.gridOrder}`;
            str += line + tab + tab + tab + tab + `, orderOnNew: ${f.orderOnNew}`;
            str += line + tab + tab + tab + tab + `, orderOnDetails: ${f.orderOnDetails}`;
            str += line + tab + tab + tab + tab + `, orderOnEdit: ${f.orderOnEdit}`;
            str += line + tab + tab + tab + tab + `, orderOnImport: ${f.orderOnImport}`;
            str += line + tab + tab + tab + tab + `, globalOrder: ${f.globalOrder}`;
            str += line + tab + tab + tab + tab + `, value: null`;
            str += line + tab + tab + tab + `}`;
        });
        str += line + tab + tab + `]`;
        
        str += line + tab + tab + `, view: [`;
        this.entity.view.forEach((v: ViewJoinDefinition, index: number) => {
            str += (index === 0 ? line + tab + tab + tab : ', ') + `{`;
            str += line + tab + tab + tab + tab + `joinType: '${v.joinType}'`;
            str += line + tab + tab + tab + tab + `, joinTable: '${v.joinTable}'`;
            str += line + tab + tab + tab + tab + `, joinStatement: '${v.joinStatement}'`;
            str += line + tab + tab + tab + `}`;
        });
        str += line + tab + tab + `]`;

        str += line + tab + `};`;
        
        // constructor
        str += line;
        str += line + tab + `constructor(base?: any){`;
        str += line + tab + tab + `if (base !== undefined){`;
        flagForViewFields = true;
        this.entity.fields.forEach(f => {
            if (!f.isTableField && flagForViewFields) {
                flagForViewFields = false;
                str += line;
            }
            if (['date', 'datetime'].indexOf(f.dbType) !== -1){
                str += line + tab + tab + tab + `this.${f.dbName} = (base.${f.dbName} !== null) ? new Date(base.${f.dbName}) : null;`;
            } else {
                str += line + tab + tab + tab + `this.${f.dbName} = base.${f.dbName};`;
            }
        });
        str += line + tab + tab + `}`;
        str += line + tab + `}`;
        str += line;
        str += line + tab + `recordName = () => {`;
        str += line + tab + tab + `return this.metadata.fields.filter(f => f.isRecordName).map(f => {`;
        str += line + tab + tab + tab + `return \`\${f.dbName} = \${this[f.dbName]}\`;`;
        str += line + tab + tab + `}).join(', ');`;
        str += line + tab + `};`;
        
        // last bracket
        str += line + `}`;

        // Peek into recordName fields to detect if an entity lacks of an identifier
        const recordNameStr: string = this.entity.fields.filter(f => f.isRecordName)
            .map(f => f.dbName).join(', ');
        if (recordNameStr) {
            console.log(`Entity ${entityName} has these recordName fields: ${recordNameStr}`);
        } else {
            console.error(`Entity ${entityName} has NO recordName fields!! it is better to have at least one.`);
        }

        // write file
        this.saveToFile(`src/crosscommon/entities/${entityName}.ts`, str);
    }

    __validateRecordName = (entity: EntityDefinition): boolean => {
        return entity.fields.filter(f => f.isRecordName).length > 0;
    }

    checkEntityDefinition = (): string => {
        let str: string = '';

        // Verify recordName existence
        if (!this.__validateRecordName(this.entity)) {
            str += `[Warn] Entity ${this.entity.name} has NO recordName fields!! it is better to have at least one.`;
        }

        return str;
    }
}
