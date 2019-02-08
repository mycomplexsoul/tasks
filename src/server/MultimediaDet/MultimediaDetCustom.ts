import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { MultimediaDet } from "../../crosscommon/entities/MultimediaDet";

export class MultimediaDetCustom {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new MultimediaDet());

        api.list({ q: node.request.query['q'] }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    createRequestHandler = (node: iNode) => {
        this.create(node.request.body).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    create = (body: any): Promise<any> => {
        const api: ApiModule = new ApiModule(new MultimediaDet());

        return api.create({ body }, {});
    };

    update = (node: iNode) => {
        let api: ApiModule = new ApiModule(new MultimediaDet());

        const hooks: any = {
        };

        api.update({ body: node.request.body, pk: node.request.params }, hooks).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };
}
