import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { Preset } from "../../crosscommon/entities/Preset";

export class PresetServer {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Preset());

        api.list({ q: node.request.query['q'] }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    create = (node: iNode) => {
        const api: ApiModule = new ApiModule(new Preset());

        api.create({ body: node.request.body }, {}).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    update = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Preset());

        api.update({ body: node.request.body, pk: node.request.params }, {}).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };
}