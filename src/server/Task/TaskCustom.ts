import { Task } from "../../crosscommon/entities/Task";
import { TaskTimeTracking } from "../../crosscommon/entities/TaskTimeTracking";
import { iNode } from "../iNode";
import { ApiModule } from "../ApiModule";
import { MoSQL } from "../MoSQL";
import ConnectionService from "../ConnectionService";
import iConnection from "../iConnection";

export class TaskCustom {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Task());

        const queue = [{
            sql: 'select * from vitask',
            q: node.request.query['q'],
            model: new Task(),
            name: 'tasks'
        }, {
            sql: `select * from vitasktimetracking where tsh_id in (select tsk_id from task where tsk_ctg_status < 3 or tsk_date_add >= '2018-10-01')`,
            model: new TaskTimeTracking(),
            name: 'timetracking'
        }];

        api.multipleListWithSQL({ queue }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    createRequestHandler = (node: iNode) => {
        this.create(node.request.body).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    create = (body: any): Promise<any> => {
        const api: ApiModule = new ApiModule(new Task());

        const hooks: any = {
            afterInsertOK: (response: any, model: Task) => {
                // generate timetracking
                return this.insertTimeTracking([model]).then(result => {
                    return result;
                });
            }
        };

        return api.create({ body }, hooks);
    };

    insertTimeTracking = (taskList: Task[]): Promise<any> => {
        const sqlMotor: MoSQL = new MoSQL(new TaskTimeTracking());
        let sqlList: string[] = []; // single list of sql for all time tracking

        taskList.forEach((item: Task) => { // each task
            const history = item['tsk_time_history'];

            if (history && history.length) {
                sqlList.push(`delete from tasktimetracking where tsh_id = '${item.tsk_id}'`); // clean up

                history.forEach((h: any) => { // each time tracking
                    sqlList.push(sqlMotor.toInsertSQL(new TaskTimeTracking(h)));
                });
            }
        });

        if (!sqlList.length) {
            return Promise.resolve([]);
        }

        const connection: iConnection = ConnectionService.getConnection();
        return Promise.all(connection.runSqlArray(sqlList)).then(response => {
            connection.close();
            return response;
        });
    }

    updateRequestHandler = (node: iNode) => {
        this.update(node.request.body, node.request.params).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    update = (body: any, pk: any): Promise<any> => {
        const api: ApiModule = new ApiModule(new Task());

        const hooks: any = {
            afterUpdateOK: (response: any, model: Task) => {
                // generate timetracking
                model['tsk_time_history'] = body['tsk_time_history'];
                return this.insertTimeTracking([model]);
            }
        };

        return api.update({ body, pk }, hooks);
    };

    batchRequestHandler = (node: iNode) => {
        this.batch(node.request.body).then((response: any) => {
            node.response.end(JSON.stringify(response));
        });
    };

    batch = (body: any) => {
        const api: ApiModule = new ApiModule(new Task());

        return api.batch({ body }, {});
    };
}
