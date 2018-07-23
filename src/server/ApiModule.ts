import { iEntity } from "../crosscommon/iEntity";
import { iNode } from "./iNode";
import iConnection from "./iConnection";
//import { Promise } from "es6-promise";
import { MoSQL } from "./MoSQL";
import ConnectionService from './ConnectionService';
import { Movement } from "../crosscommon/entities/Movement";

export class ApiModule {
    model: iEntity;

    constructor(model: iEntity){
        this.model = model;
    }
    
    list = (node: iNode): Promise<iEntity[]> => {
        let connection: iConnection = ConnectionService.getConnection();
        let params: string = node.request.query['q'];
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
    };

    arePKProvided = (pk: string[], values: string[]): boolean => {
        return pk.every((f => values.includes(f)));
    };

    update = (node: iNode, hooks: any): Promise<any> => {
        const pkInRequest = this.arePKProvided(this.model.metadata.fields.filter(f => f.isPK).map(f => f.dbName), Object.keys(node.request.params));
        if (node.request.body && pkInRequest) {
            let sql: string = "";
            const connection: iConnection = ConnectionService.getConnection();
            const baseModel: iEntity = { ...this.model };
            // Assign data from request
            this.model.metadata.fields.filter(f => f.isTableField).forEach(f => {
                this.model[f.dbName] = node.request.body[f.dbName];
            });
            const sqlMotor: MoSQL = new MoSQL(this.model);
            const recordName: string = this.model.recordName();

            return connection.runSql(sqlMotor.toSelectPKSQL()).then((response) => {
                if (response.err){
                    console.log(`You try an update on a task that does not exist in the server. id: ${recordName}`);
                    // create it
                    this.create(node, {}).then((responseCreate) => {
                        let msg = `You tried to update on a ${this.model.metadata.tableName} that does not exist in the server. id: ${recordName}. Tried to create it.`;
                        return {operationOk: responseCreate.operationOk, message: `${msg} ${responseCreate.message}`};
                    });
                }
    
                if (!response.err && response.rows.length > 0){
                    this.model.metadata.fields.filter(f => f.isTableField).forEach(f => {
                        baseModel[f.dbName] = response.rows[0][f.dbName];
                    });
                }
                sql = sqlMotor.toUpdateSQL(this.model, baseModel);
                connection.runSql(sql).then((responseUpdate) => {
                    connection.close();
                    if (responseUpdate.err){
                        return {operationOk: false, message: `Error on ${this.model.metadata.tableName} modification. id: ${recordName}`};
                    } else {
                        let resultAfterUpdateOK: any;
                        if (hooks && hooks.afterUpdateOK){
                            return hooks.afterUpdateOK(responseUpdate, this.model).then((resultAfterUpdateOk: any) => {
                                return {operationOk: true, message: `${this.model.metadata.tableName} created correctly. id: ${recordName}${resultAfterUpdateOK ? `, afterUpdateOk: ${resultAfterUpdateOK.message}` : ''}`};
                            });
                        }
                        return {operationOk: true, message: `${this.model.metadata.tableName} updated correctly. id: ${recordName}`};
                    }
                });
            });
        }
    };

    /**
     * Data structure for sync: {
     *  queue: [{
     *      method: 'create|update|delete'
     *      , entity: 'movement|catalog|...'
     *      , data: {
     *          ... // field: value
     *      }
     *  }]
     * }
     */
    /*sync = (node: iNode, hooks: any): Promise<any> => {
        if (node.request.body){
            let sql: string = "";
            const connection: iConnection = ConnectionService.getConnection();
            
            // Iterate queue
            const queue: any[] = node.request.body.queue;
            queue.forEach(({method, entity, data}) => {
                let model: iEntity;

                switch(entity){
                    case 'movement': {
                        model = new Movement();
                        break;
                    }
                    default: {
                        // skip this but add something to identify it for the response
                    }
                }

                if (method === 'create') {
                    // TODO: I think this needs to have the data separated from the request itself to be reusable
                    // this.create(node, data, hooks).then(...)
                    this.create(node, { model, data }, hooks).then(createResponse => {

                    });
                }
            });
          
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
    };*/
}
