import { Task } from "../../crosscommon/entities/Task";

import { iNode } from "../iNode";
import { TaskCustom } from "../Task/TaskCustom";
import { iEntity } from "../../crosscommon/iEntity";
import { Multimedia } from "../../crosscommon/entities/Multimedia";
import { MultimediaCustom } from "../Multimedia/MultimediaCustom";
import { ApiModule } from "../ApiModule";
import { Catalog } from "../../crosscommon/entities/Catalog";
import { MultimediaDet } from "../../crosscommon/entities/MultimediaDet";
import { MultimediaDetCustom } from "../MultimediaDet/MultimediaDetCustom";
import { MultimediaView } from "../../crosscommon/entities/MultimediaView";

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
        let resultPromiseList: any[] = [];

        queue.forEach((q: syncItem) => {
            if (q.status !== 'queue') {
                return false;
            }

            try {
                q = Object.assign(q, this.parseEntity(q.entity));
            } catch(e) {
                q.result = {
                    operationOk: false,
                    message: `sync failed due to entity ${q.entity} is not supported`,
                    pk: q.pk
                };
                return false;
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

    _list = (node: iNode) => {
        const { entity, q } = node.request.query;
        let construct;
        let result;

        try {
            construct = this.parseEntity(entity).construct;
        } catch(e) {
            const final: iEntity[] = [];
            result = {
                operationOk: false,
                message: `sync failed due to entity ${entity} is not supported`,
                list: final
            };
            return Promise.resolve(result);
        }

        const model: iEntity = construct({});
        const ApiMotor: ApiModule = new ApiModule(model);

        return ApiMotor.list({ q, model }).then(list => {
            return {
                operationOk: true,
                message: `sync listing success`,
                list
            };
        });
    };

    list = (node: iNode) => {
        let response;
        this._list(node).then(data => {
            response = data;
            node.response.end(JSON.stringify(response));
        });
    };

    parseEntity(entity: string): {construct: (b: any) => iEntity, server: any} {
        let construct;
        let server;
        
        switch(entity) {
            case 'Task': {
                construct = (base: any) => new Task(base);
                server = new TaskCustom();
                break;
            }
            case 'Multimedia': {
                construct = (base: any) => new Multimedia(base);
                server = new MultimediaCustom();
                break;
            }
            case 'MultimediaDet': {
                construct = (base: any) => new MultimediaDet(base);
                server = new MultimediaDetCustom();
                break;
            }
            case 'MultimediaView': {
                construct = (base: any) => new MultimediaView(base);
                server = {
                    create: (body: any): Promise<any> => {
                        const api: ApiModule = new ApiModule(new MultimediaView());

                        return api.create({ body }, {});
                    },
                    update: () => {

                    }
                };
                break;
            }
            case 'Catalog': {
                construct = (base: any) => new Catalog(base);
                //server = new CatalogCustom();
                break;
            }
            default: {
                throw new Error(`sync failed due to entity ${entity} is not supported`);
            }
        }

        return {
            construct,
            server
        };
    }
}
