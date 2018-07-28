import { iEntity } from "../crosscommon/iEntity";
import { Catalog } from "../crosscommon/entities/Catalog";
import { FieldDefinition } from "../crosscommon/FieldDefinition";
import { MoGen } from "../crosscommon/MoGen";

export class MoInstallSQL {
    createTableSQL = (model: iEntity): string => {
        let sql: string = '';
        let dbType: string = '';
        
        model.metadata.fields.filter((f: FieldDefinition) => f.isTableField).forEach((f: FieldDefinition) => {
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

        sql = `create table ${model.metadata.tableName} (${sql})`;

        return sql;
    }

    createPKSQL = (model: iEntity): string => {
        let sql: string = '';
        
        model.metadata.fields.forEach((f) => {
            if (f.isPK){
                sql = MoGen.concat(sql, ", ") + `${f.dbName}`;
            }
        });

        sql = `create unique index ${model.metadata.tableName}_pk on ${model.metadata.tableName} (${sql})`;
        return sql;
    }

    createViewSQL = (model: iEntity): string => {
        let sql: string = '';
        let fields = "";
        let containsJoinToSelf = model.metadata.view.filter(j => j.joinTable.toLowerCase().startsWith(model.metadata.tableName.toLowerCase()+' '));
        // create view {name} as select {fields} from {table} inner join ...
        
        model.metadata.fields.forEach((f) => {
            if (f.isTableField){
                fields = MoGen.concat(fields,", ") + (containsJoinToSelf ? model.metadata.tableName + '.' : '') + f.dbName;
            } else {
                if (f.originTable === "CATALOG"){
                    if (model.metadata.tableName !== "catalog"){
                        fields = MoGen.concat(fields,", ") + `(select ctg_name from catalog where ctg_id = '${f.catalogId}' and ctg_sequential = ${f.linkedField}) as ${f.dbName}`;
                    } else {
                        fields = MoGen.concat(fields,", ") + `(select catalog2.ctg_name from catalog catalog2 where ctg_id = '${f.catalogId}' and catalog2.ctg_sequential = catalog.${f.linkedField}) as ${f.dbName}`;
                    }
                } else {
                    fields = MoGen.concat(fields,", ") + `(${f.linkedField}) as ${f.dbName}`;
                }
            }
        });

        model.metadata.view.forEach(function(f){
            sql = MoGen.concat(sql," ") + `${f.joinType} JOIN ${f.joinTable} ON (${f.joinStatement})`;
        });

        sql = `create view ${model.metadata.viewName} as select ${fields} from ${model.metadata.tableName} ${sql}`;

        return sql;
    }
}