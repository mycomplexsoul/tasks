import { iEntity } from "../crosscommon/iEntity";
import iConnection from "./iConnection";
import { MoSQL } from "./MoSQL";
import ConnectionService from './ConnectionService';
import { Movement } from "../crosscommon/entities/Movement";
import { Category } from "../crosscommon/entities/Category";
import { Place } from "../crosscommon/entities/Place";

export class ApiModule {
    model: iEntity;

    constructor(model: iEntity){
        this.model = model;
    }
    
    list = (data: any, model?: iEntity): Promise<iEntity[]> => {
        let m: iEntity = model ? model : this.model;
        let connection: iConnection = ConnectionService.getConnection();
        let params: string = data.q; //node.request.query['q'];
        let sqlMotor: MoSQL = new MoSQL(m);
        let sql: string = sqlMotor.toSelectSQL(params);
        let array: iEntity[] = [];
        
        return connection.runSql(sql).then((response) => {
            if (!response.err){
                array = response.rows;
                console.log(`api list query returned ${array.length} rows`);
            }
            connection.close();
            return array;
        });
    };

    create = (data: any, hooks: any, model?: iEntity): Promise<any> => {
        let m: iEntity = model ? model : this.model;
        if (data.body){
            let sql: string = "";
            const connection: iConnection = ConnectionService.getConnection();
            // Assign data from request
            m.metadata.fields.filter(f => f.isTableField).forEach(f => {
                m[f.dbName] = data.body[f.dbName];
            });
            const sqlMotor: MoSQL = new MoSQL(m);
            const recordName: string = m.recordName();

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
                    return {operationOk: false, message: `${m.metadata.tableName} already exists. id: ${recordName}`};
                }

                sql = sqlMotor.toInsertSQL();
                console.log('insert sql from create', sql);
    
                return connection.runSql(sql).then(responseCreate => {
                    connection.close();
                    if (responseCreate.err){
                        return {operationOk: false, message: `Error on ${m.metadata.tableName} creation. id: ${recordName}`};
                    } else {
                        let resultAfterInsertOK: any;
                        if (hooks && hooks.afterInsertOK){
                            return hooks.afterInsertOK(responseCreate, m).then((resultAfterInsertOk: any) => {
                                return {operationOk: true, message: `${m.metadata.tableName} created correctly. id: ${recordName}${resultAfterInsertOK ? `, afterInsertOk: ${resultAfterInsertOK.message}` : ''}`};
                            });
                        }
                        return {operationOk: true, message: `${m.metadata.tableName} created correctly. id: ${recordName}`};
                    }
                });
            });
        }
    };

    update = (data: any, hooks: any, model?: iEntity): Promise<any> => {
        let m: iEntity = model ? model : this.model;
        const arePKProvided = (pk: string[], values: string[]): boolean => {
            return pk.every((f => values.includes(f)));
        };
        const pkInRequest = arePKProvided(m.metadata.fields.filter(f => f.isPK).map(f => f.dbName), Object.keys(data.pk));
        if (data.body && pkInRequest) {
            let sql: string = "";
            const connection: iConnection = ConnectionService.getConnection();
            const baseModel: iEntity = { ...m };
            // Assign data from request
            m.metadata.fields.filter(f => f.isTableField).forEach(f => {
                m[f.dbName] = data.body[f.dbName];
            });
            const sqlMotor: MoSQL = new MoSQL(m);
            const recordName: string = m.recordName();

            return connection.runSql(sqlMotor.toSelectPKSQL()).then((response) => {
                if (response.err){
                    console.log(`You try an update on a task that does not exist in the server. id: ${recordName}`);
                    // create it
                    this.create(data, hooks).then((responseCreate) => {
                        let msg = `You tried to update on a ${m.metadata.tableName} that does not exist in the server. id: ${recordName}. Tried to create it.`;
                        return {operationOk: responseCreate.operationOk, message: `${msg} ${responseCreate.message}`};
                    });
                }
    
                if (!response.err && response.rows.length > 0){
                    m.metadata.fields.filter(f => f.isTableField).forEach(f => {
                        baseModel[f.dbName] = response.rows[0][f.dbName];
                    });
                }
                sql = sqlMotor.toUpdateSQL(m, baseModel);
                connection.runSql(sql).then((responseUpdate) => {
                    connection.close();
                    if (responseUpdate.err){
                        return {operationOk: false, message: `Error on ${m.metadata.tableName} modification. id: ${recordName}`};
                    } else {
                        let resultAfterUpdateOK: any;
                        if (hooks && hooks.afterUpdateOK){
                            return hooks.afterUpdateOK(responseUpdate, m).then((resultAfterUpdateOk: any) => {
                                return {operationOk: true, message: `${m.metadata.tableName} created correctly. id: ${recordName}${resultAfterUpdateOK ? `, afterUpdateOk: ${resultAfterUpdateOK.message}` : ''}`};
                            });
                        }
                        return {operationOk: true, message: `${m.metadata.tableName} updated correctly. id: ${recordName}`};
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
     *      , pk: {
     *          ... // pk_field: value (only for update)
     *      }
     *      , data: {
     *          ... // field: value
     *      }
     *  }]
     * }
     */
    sync = (data: any, hooks: any): Promise<any> => {
        if (data.body){
            let promiseQueue: Promise<any>[] = [];
            
            // Iterate queue
            const queue: any[] = data.body.queue;
            promiseQueue = queue.map(({method, entity, body, pk}) => {
                let model: iEntity;

                switch(entity){
                    case 'movement': {
                        model = new Movement();
                        break;
                    }
                    case 'category': {
                        model = new Category();
                        break;
                    }
                    case 'place': {
                        model = new Place();
                        break;
                    }
                    default: {
                        // skip this but add something to identify it for the response
                    }
                }

                if (method === 'create') {
                    return this.create({ body }, hooks, model).then(createResponse => {
                        return {
                            method
                            , entity
                            , res: createResponse
                        };
                    });
                }

                if (method === 'update') {
                    return this.update({ body, pk }, hooks, model).then(updateResponse => {
                        return {
                            method
                            , entity
                            , pk
                            , res: updateResponse
                        };
                    });
                }
            });

            return Promise.all(promiseQueue).then(allResponses => {
                return allResponses;
            });
        }
    };
}
