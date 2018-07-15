import { iEntity } from "../crosscommon/iEntity";
import { iNode } from "./iNode";
import iConnection from "./iConnection";
import { Promise } from "es6-promise";
import { MoSQL } from "./MoSQL";
import ConnectionService from './ConnectionService';

export class ApiModule {
    model: iEntity;

    constructor(model: iEntity){
        this.model = model;

    }
    
    list = (node: iNode): Promise<iEntity[]> => {
        let connection: iConnection = ConnectionService.getConnection();
        let params: string = node.request['query'];
        let sqlMotor: MoSQL = new MoSQL(this.model);
        let sql: string = sqlMotor.toSelectSQL(params);
        let data: iEntity[] = [];
    
        return connection.runSql(sql).then((response) => {
            if (!response.err){
                data = response.rows;
                console.log(`api list query returned ${data.length} rows`);
            }
            connection.close();
            return data;
        });
    };

    create = (node: iNode, hooks: any): Promise<any> => {
        if (node.request.body){
            let sql: string = "";
            const connection: iConnection = ConnectionService.getConnection();
            // Assign data from request
            this.model.metadata.fields.filter(f => f.isTableField).forEach(f => {
                this.model[f.dbName] = node.request.body[f.dbName];
            });
            const sqlMotor: MoSQL = new MoSQL(this.model);
            const recordName: string = this.model.recordName();

            return connection.runSql(sqlMotor.toSelectPKSQL()).then((response) => {
                if (response.err){
                    //console.log(`got this error trying to validate if this ${strName} already exists`,err);
                    return false;
                }
    
                if (response.rows.length > 0){
                    //console.log(`${model.tableName} already exists: ${strName}`);
                    return false;
                } else {
                    return response;
                }
            }).then((response) => {
                if (!response){
                    return {operationOk: false, message: `${this.model.metadata.tableName} already exists. id: ${recordName}`};
                }

                sql = sqlMotor.toInsertSQL();
                console.log('insert sql from create', sql);
    
                return connection.runSql(sql).then(responseCreate => {
                    connection.close();
                    if (responseCreate.err){
                        return {operationOk: false, message: `Error on ${this.model.metadata.tableName} creation. id: ${recordName}`};
                    } else {
                        let resultAfterInsertOK: any;
                        if (hooks && hooks.afterInsertOK){
                            return hooks.afterInsertOK(responseCreate, this.model).then((resultAfterInsertOk: any) => {
                                return {operationOk: true, message: `${this.model.metadata.tableName} created correctly. id: ${recordName}${resultAfterInsertOK ? `, afterInsertOk: ${resultAfterInsertOK.message}` : ''}`};
                            });
                        }
                        return {operationOk: true, message: `${this.model.metadata.tableName} created correctly. id: ${recordName}`};
                    }
                });
            });
        }
    }
}
/*
let MoSQL = require("../MoSQL.js");

let API = (function(MoSQL){
    let forModel = (modelName) => {
    
        let update = function(node) {
            let t = MoSQL.createModel(model.name);
            let tWithChanges = MoSQL.createModel(model.name);
            if (node.post){
                let connection = node.ConnectionService.getConnection(node.mysql);
                
                return connection.runSql(model.sqlSelect()).then((response) => {
                    let strName = model.recordName();
                    if (response.err){
                        console.log(`You try an update on a task that does not exist in the server. id: ${strName}`);
                        // create it
                        create(node).then((responseCreate) => {
                            let msg = `You try an update on a ${model.tableName} that does not exist in the server. id: ${strName}. Tried to create it.`;
                            return {operationOk: responseCreate.operationOk, message: `${msg} ${responseCreate.message}`};
                        });
                    }
                    if (!response.err && response.rows.length > 0){
                        t.setDBAll(response.rows[0]); // original task from DB
                    }
                    tWithChanges.setDBAll(node.post);
                    let sql = t.toUpdateSQL(tWithChanges);
    
                    connection.runSql(sql).then((responseUpdate) => {
                        connection.close();
                        if (responseUpdate.err){
                            return {operationOk: false, message: `Error on ${model.tableName} modification. id: ${strName}`};
                        } else {
                            return {operationOk: true, message: `${model.tableName} updated correctly. id: ${strName}`};
                        }
                    });
                });
            }
        }
    
        let api = function(method,node) {
            return this[method](node).then(data => {
                node.response.end(JSON.stringify(data));
            });
        };

        return {
            setModel
            , list
            , create
            , update
            , api
        };
    };

    return {
        forModel
    };
})(MoSQL);
module.exports = API;*/