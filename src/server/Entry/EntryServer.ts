import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { Entry } from "../../crosscommon/entities/Entry";

export class EntryServer {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Entry());

        api.list({ q: node.request.query['q'] }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };
}