import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { LastTime } from "../../crosscommon/entities/LastTime";

export class LastTimeServer {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new LastTime());

        api.list({ q: node.request.query['q'] }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    create = (node: iNode) => {
        const api: ApiModule = new ApiModule(new LastTime());

        api.create({ body: node.request.body }, {}).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };
}