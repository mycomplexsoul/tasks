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
                return this.generateHistory([model]).then(result => {
                    if (result.operationOk) {
                        return {message: `history: ${result.message}`};
                    }
                });
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
}