import { iEntity } from "../crosscommon/iEntity";
import iConnection from "./iConnection";
import { MoSQL } from "./MoSQL";
import ConnectionService from './ConnectionService';

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
            return pk.every((f => values.indexOf(f) !== -1));
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
                if (sqlMotor.toChangesObject(m, baseModel).length > 0) {
                    sql = sqlMotor.toUpdateSQL(m, baseModel);
                    return connection.runSql(sql).then((responseUpdate) => {
                        connection.close();
                        if (responseUpdate.err){
                            return {operationOk: false, message: `Error on ${m.metadata.tableName} modification. id: ${recordName}`};
                        } else {
                            if (hooks && hooks.afterUpdateOK){
                                return hooks.afterUpdateOK(responseUpdate, m).then((resultAfterUpdateOk: any) => {
                                    return {operationOk: true, message: `${m.metadata.tableName} created correctly. id: ${recordName}${resultAfterUpdateOk ? `, afterUpdateOk: ${resultAfterUpdateOk.message}` : ''}`};
                                });
                            }
                            return {operationOk: true, message: `${m.metadata.tableName} updated correctly. id: ${recordName}`};
                        }
                    });
                } else {
                    // Main object has no changes, process the rest of the chain
                    if (hooks && hooks.afterUpdateOK){
                        return hooks.afterUpdateOK({}, m).then((resultAfterUpdateOk: any) => {
                            return {operationOk: true, message: `${m.metadata.tableName} created correctly. id: ${recordName}${resultAfterUpdateOk ? `, afterUpdateOk: ${resultAfterUpdateOk.message}` : ''}`};
                        });
                    }
                    return {operationOk: true, message: `${m.metadata.tableName} updated correctly. id: ${recordName}`};
                }
            });
        }
    };

    listWithSQL = (data: any, model?: iEntity): Promise<iEntity[]> => {
        let m: iEntity = model ? model : this.model;
        let connection: iConnection = ConnectionService.getConnection();
        let params: string = data.q; //node.request.query['q'];
        let sqlMotor: MoSQL = new MoSQL(m);
        let sql: string = data.sql;
        if (params){
            sql += ` where ${sqlMotor.criteriaToSQL(sqlMotor.parseSQLCriteria(params), m)}`;
        }
        let array: iEntity[] = [];
        
        return connection.runSql(sql).then((response) => {
            if (!response.err){
                array = response.rows;
                console.log(`api list with SQL query returned ${array.length} rows`);
            }
            connection.close();
            return array;
        });
    };

    multipleListWithSQL = (data: any): Promise<any> => {
        let connection: iConnection = ConnectionService.getConnection();
        let sqlMotor: MoSQL = new MoSQL();

        return Promise.all(
            connection.runSqlArray(
                data.queue.map((item: any) => {
                    sqlMotor = new MoSQL(item.model);
                    let finalSql: string = item.sql;
                    if (item.q){
                        finalSql += ` where ${sqlMotor.criteriaToSQL(sqlMotor.parseSQLCriteria(item.q), item.model)}`;
                    }
                    return finalSql;
                })
            )
        ).then(array => {
            let obj = {};
            data.queue.forEach((item: any, index: number) => {
                obj[item.name] = array[index].rows;
            });
            connection.close();
            return obj;
        }).catch(err => {
            connection.close();
            return {};
        });
    };

    batch = (data: any, hooks: any, model?: iEntity): Promise<any> => {
        let m: iEntity = model ? model : this.model;
        let connection: iConnection;
        let results: Promise<any>[] = [];
        if (data.body){
            connection = ConnectionService.getConnection();
            results = data.body.map((item: any) => { // map items to entities
                // Assign data from request
                m.metadata.fields.filter(f => f.isTableField).forEach(f => {
                    m[f.dbName] = item[f.dbName];
                });
                return {...m};
            }).map((model: any) => { // map entities to (entities, sql select)
                const sqlMotor: MoSQL = new MoSQL(model);
                return {
                    model: model,
                    sqlSelect: sqlMotor.toSelectPKSQL(),
                    sqlInsert: sqlMotor.toInsertSQL()
                };
            }).map((item: any) => { // map entities to promises
                const recordName: string = item.model.recordName();
    
                return connection.runSql(item.sqlInsert).then(responseCreate => {
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
        return Promise.all(results).then((response: any) => {
            if (connection) {
                connection.close();
            }
            return response;
        });
    };
}
