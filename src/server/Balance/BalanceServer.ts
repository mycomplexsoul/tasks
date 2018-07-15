import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { Balance } from "../../crosscommon/entities/Balance";

export class BalanceServer {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Balance());

        api.list(node).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };
}
