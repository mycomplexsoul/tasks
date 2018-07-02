import { iEntity } from "../crosscommon/iEntity";
import { Catalog } from "../crosscommon/entities/Catalog";
import { FieldDefinition } from "../crosscommon/FieldDefinition";
import { MoGen } from "../crosscommon/MoGen";

export class MoInstallSQL {
    model: iEntity = null;
    
    constructor(model: iEntity){
        this.model = model;
    }

    createTableSQL = (): string => {
        let sql: string = '';
        let dbType: string = '';
        let fields: FieldDefinition[] = this.model.metadata.fields;
        
        fields.filter((f: FieldDefinition) => f.isTableField).forEach((f: FieldDefinition) => {
            switch(f.dbType){
                case "integer":
                case "long":
                case "double":
                    dbType = `NUMERIC(${f.size},${f.decimal})`;
                    break;
                case "string":
                    dbType = `VARCHAR(${f.size})`;
                    break;
                case "date":
                    dbType = `DATE`;
                    break;
                case "datetime":
                    dbType = `DATETIME`;
                    break;
            }
            sql = MoGen.concat(sql,", ") + `${f.dbName} ${dbType} ${f.allowNull ? "":"NOT NULL"}`;
        });

        sql = `create table ${this.model.metadata.tableName} (${sql})`;

        return sql;
    }

    createPKSQL = (): string => {
        let sql: string = '';
        return sql;
    }

    createViewSQL = (): string => {
        let sql: string = '';
        return sql;
    }
}