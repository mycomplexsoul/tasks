import { Task } from "../../crosscommon/entities/Task";

import { iNode } from "../iNode";
import { TaskCustom } from "../Task/TaskCustom";
import { iEntity } from "../../crosscommon/iEntity";

class syncItem {
    action: string
    model: any
    pk: any
    callback: Function
    status: string
    entity: string
    construct: Function
    server: any
    result: any
}

export class SyncCustom {
    /**
     * Sync multiple entity data.
     * Payload schema: {
     *  queue: [
     *      {
     *          action: 'create|update|delete',
     *          model: { tsk_id: ... },
     *          pk: { tsk_id: ... }, // only for update and delete
     *          callback: function({operationOk, message, data}),
     *          status: 'queue|processed|error',
     *          entity: 'Task'
     *      }
     *  ]
     * }
     * 
     * Response schema: {
     *  operationOk: boolean,
     *  message: string,
     *  result: [
     *      {
     *          operationOk: boolean,
     *          message: string,
     *          recordName: string,
     *          data: { tsk_id: ... }
     *          pk: { tsk_id: ... }
     *      }
     *  ]
     * }
     */
    syncAll = (node: iNode) => {
        const { queue } = node.request.body;
        let resultPromiseList = [];

        queue.forEach((q: syncItem) => {
            if (q.status !== 'queue') {
                return false;
            }

            switch(q.entity) {
                case 'Task': {
                    q.construct = (base: any) => new Task(base);
                    q.server = new TaskCustom();
                }
            }

            if (!q.server[q.action]) {
                const item: iEntity = q.construct(q.model);

                q.result = {
                    operationOk: false,
                    message: `sync failed due to action ${q.action} is not supported in ${q.entity}`,
                    recordName: item.recordName(),
                    pk: q.pk
                };
                return false;
            }

            const result: Promise<any> = q.server[q.action](q.model, q.pk);
            resultPromiseList.push(result);
            
            result.then((response: {
                operationOk: boolean,
                message: string,
                data?: any,
                pk: any
            }) => {
                response.pk = q.pk;
    
                if (q.callback) {
                    q.callback(response);
                }
    
                q.result = response;
            });
        });

        Promise.all(resultPromiseList).then(list => {
            const response = {
                operationOk: true,
                message: 'sync completed',
                result: queue.map((q: syncItem) => q.result)
            };
    
            node.response.end(JSON.stringify(response));
        });
    };
}
