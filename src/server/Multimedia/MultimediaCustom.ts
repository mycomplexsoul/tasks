import { ApiModule } from "../ApiModule";
import { iNode } from "../iNode";
import { Multimedia } from "../../crosscommon/entities/Multimedia";

export class MultimediaCustom {
    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Multimedia());

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
        const api: ApiModule = new ApiModule(new Multimedia());
        
        return api.create({ body }, {});
    };
    
    updateRequestHandler = (node: iNode) => {
        this.update(node.request.body, node.request.params).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    update = (body: any, pk: any): Promise<any> => {
        let api: ApiModule = new ApiModule(new Multimedia());

        return api.update({ body, pk }, {});
    };
}