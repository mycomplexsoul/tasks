import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { Account } from "../../crosscommon/entities/Account";

export class AccountServer {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Account());

        api.list({ q: node.request.query['q'] }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };
}