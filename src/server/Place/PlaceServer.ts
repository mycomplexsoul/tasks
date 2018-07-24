import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { Place } from "../../crosscommon/entities/Place";

export class PlaceServer {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Place());

        api.list({ q: node.request.query['q'] }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    create = (node: iNode) => {
        const api: ApiModule = new ApiModule(new Place());

        api.create({ body: node.request.body }, {}).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };
}