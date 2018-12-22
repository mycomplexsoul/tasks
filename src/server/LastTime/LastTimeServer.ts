import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { LastTime } from "../../crosscommon/entities/LastTime";
import { LastTimeHistory } from "../../crosscommon/entities/LastTimeHistory";
import iConnection from "../iConnection";
import { MoSQL } from "../MoSQL";
import ConnectionService from "../ConnectionService";
import { DateUtils } from "../../crosscommon/DateUtility";

export class LastTimeServer {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new LastTime());

        api.list({ q: node.request.query['q'] }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    create = (node: iNode) => {
        const api: ApiModule = new ApiModule(new LastTime());

        const hooks: any = {
            afterInsertOK: (response: any, model: LastTime) => {
                return this.generateHistory([model]).then(result => {
                    if (result.operationOk) {
                        return {message: `history: ${result.message}`};
                    }
                });
            }
        };

        api.create({ body: node.request.body }, hooks).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    update = (node: iNode) => {
        let api: ApiModule = new ApiModule(new LastTime());

        const hooks: any = {
            afterUpdateOK: (response: any, model: LastTime) => {
                if (model.lst_ctg_status === 1) {
                    return this.generateHistory([model]).then(result => {
                        if (result.operationOk) {
                            return {message: `history: ${result.message}`};
                        } else {
                            return {message: `not ok: ${result}`};
                        }
                    }).catch(err => {
                        return {message: `error: ${err}`};
                    });
                } else {
                    // cancel or archive
                    return Promise.resolve(response);
                }
            }
        };

        api.update({ body: node.request.body, pk: node.request.params }, hooks).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    generateHistory(modelList: LastTime[]): Promise<{operationOk: boolean, message: string}> {
        const connection: iConnection = ConnectionService.getConnection();
        const sqlMotor: MoSQL = new MoSQL();

        // get all history to find sequentials
        let sql = 'SELECT lth_id, max(lth_num_sequential) as lth_num_sequential from vilasttimehistory';
        if (modelList.length === 1) {
            sql += ` where lth_id = '${modelList[0].lst_id}'`;
        }
        sql += ` group by lth_id`;

        return connection.runSql(sql).then(sqlData => {
            // iterate items
            let itemList: Array<LastTimeHistory> = [];
            modelList.forEach((m: LastTime) => {
                // get sequential
                const historyItem: {lth_id: string, lth_num_sequential: number} = sqlData.rows.find((r: any) => r.lth_id === m.lst_id);
    
                itemList.push(new LastTimeHistory({
                    lth_id: m.lst_id,
                    lth_num_sequential: historyItem ? historyItem.lth_num_sequential + 1 : 1,
                    lth_name: m.lst_name,
                    lth_value: m.lst_value,
                    lth_validity: m.lst_validity,
                    lth_tags: m.lst_tags,
                    lth_notes: m.lst_notes,
                    lth_id_user: m.lst_id_user,
                    lth_date_add: DateUtils.newDateUpToSeconds(),
                    lth_date_mod: DateUtils.newDateUpToSeconds(),
                    lth_ctg_status: m.lst_ctg_status
                }));
            });
            // insert items
            const responsesPromises = itemList.map(e => sqlMotor.toInsertSQL(e));
            return Promise.all(connection.runSqlArray(responsesPromises)).then(values => {
                // all inserted ok
                connection.close();
                console.log(`Batch finished, inserted ok: ${itemList.length}`);
                return {operationOk: true, message: `Batch finished, inserted ok: ${itemList.length}`, data: itemList};
            }).catch(reason => {
                // some failed
                console.log('err on inserting items', reason);
                return {operationOk: false, message: `error ${reason}`};
            });
        });
    }

    async initializeDataFromBackup(node: iNode) {
        const response: any = await this._initializeDataFromBackup();
        node.response.end(JSON.stringify(response));
    }

    async backupLastTimeData(node: iNode) {
        const response: any = await this._backupLastTimeData();
        node.response.end(JSON.stringify(response));
    }

    async cleanUpData(node: iNode) {
        const response: any = await this._cleanUpData();
        node.response.end(JSON.stringify(response));
    }

    /**
     * Copies initial data from backup to default db.
     * - Deletes all lasttime records from default.
     * - Inserts all lasttime records from backup into default.
     */
    _initializeDataFromBackup(){

    }

    /**
     * Copies last time data from "default" to "backup" db.
     * - If lasttime record from default exists in backup, updates it.
     * - If lasttime record from default does not exists in backup, inserts it.
     * - Inserts all lasttimehistory from default into backup.
     * Note: run from laptop to PC, then from gear to PC. Clean up laptop, clean up gear.
     */
    async _backupLastTimeData() {
        const defaultCon: iConnection = ConnectionService.getConnection();
        const backupCon: iConnection = ConnectionService.getConnection('backup');

        const LastTimeDefaultList: LastTime[] = await defaultCon.runSql('select * from lasttime').then(data => {
            return data.rows.map((e: any) => new LastTime(e));
        });
        const LastTimeBackupList: LastTime[] = await backupCon.runSql('select * from lasttime').then(data => {
            return data.rows.map((e: any) => new LastTime(e));
        });

        const sqlArray: string[] = [];
        const sqlMotor: MoSQL = new MoSQL(new LastTime());
        LastTimeDefaultList.forEach(defItem => {
            const existentItem: LastTime = LastTimeBackupList.find(item => item.lst_id === defItem.lst_id);
            if (existentItem) {
                // update if different
                if (sqlMotor.toChangesObject(existentItem, defItem).length) {
                    // update
                    sqlArray.push(sqlMotor.toUpdateSQL(defItem, existentItem));
                } // else no changes => no update
            } else {
                // insert
                sqlArray.push(sqlMotor.toInsertSQL(defItem));
            }
        });

        const response: any[] = await Promise.all(backupCon.runSqlArray(sqlArray));

        const max = (list: LastTimeHistory[]) => {
            if (list.length) {
                const sorted: LastTimeHistory[] = list.sort((a, b) => {
                    return a.lth_num_sequential < b.lth_num_sequential ? 1 : -1;
                });
                return sorted[0];
            }
            return null;
        };

        const LastTimeHistoryBackupList: LastTimeHistory[] = await backupCon.runSql('select * from lasttimehistory').then(data => {
            return data.rows.map((e: any) => new LastTimeHistory(e));
        });
        const LastTimeHistoryDefaultList: LastTimeHistory[] = await defaultCon.runSql('select * from lasttimehistory').then(data => {
            return data.rows.map((e: any) => new LastTimeHistory(e));
        }).then((defaultList: LastTimeHistory[]) => {
            const newList: LastTimeHistory[] = [];
            defaultList.forEach(item => {
                const foundInNewList: LastTimeHistory = max(newList.filter(b => b.lth_id === item.lth_id));
                if (foundInNewList) {
                    item.lth_num_sequential = foundInNewList.lth_num_sequential + 1;
                } else {
                    const foundInDefault: LastTimeHistory = max(LastTimeHistoryBackupList.filter(b => b.lth_id === item.lth_id));
                    if (foundInDefault) {
                        item.lth_num_sequential = foundInDefault.lth_num_sequential + 1;
                    }
                }
                newList.push(item);
            });
            return newList;
        });

        const historyResponse: any[] = await Promise.all(backupCon.runSqlArray(LastTimeHistoryDefaultList.map(item => sqlMotor.toInsertSQL(item))));

        return [response, historyResponse];
    }

    /**
     * Cleans up default db to continue using it.
     * - Deletes all lasttimehistory records from default.
     */
    async _cleanUpData(){
        const defaultCon: iConnection = ConnectionService.getConnection();
        const response: any = await defaultCon.runSql('delete from lasttimehistory');
        return response;
    }
}