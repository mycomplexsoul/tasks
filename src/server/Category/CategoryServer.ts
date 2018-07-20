import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { Category } from "../../crosscommon/entities/Category";

export class CategoryServer {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Category());

        api.list(node).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    create = (node: iNode) => {
        const api: ApiModule = new ApiModule(new Category());

        api.create(node, {}).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };
}