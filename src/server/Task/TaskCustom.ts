import { Task } from "../../crosscommon/entities/Task";
import { TaskTimeTracking } from "../../crosscommon/entities/TaskTimeTracking";
import { iNode } from "../iNode";
import { ApiModule } from "../ApiModule";

export class TaskCustom {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Task());

        const queue = [{
            sql: 'select * from vitask',
            q: node.request.query['q'],
            model: new Task(),
            name: 'tasks'
        }, {
            sql: `select * from vitasktimetracking where tsh_id in (select tsk_id from task where tsk_ctg_status < 3 and tsk_date_add >= '2018-08-01')`,
            model: new TaskTimeTracking(),
            name: 'timetracking'
        }];

        api.multipleListWithSQL({ queue }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };
}
