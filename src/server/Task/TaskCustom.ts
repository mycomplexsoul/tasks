import { Task } from "../../crosscommon/entities/Task";
import { iNode } from "../iNode";
import { ApiModule } from "../ApiModule";

export class TaskCustom {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Task());

        api.list({ q: node.request.query['q'] }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };
}
