import iConnection from "./iConnection";
import ConnectionService from './ConnectionService';
import { iNode } from "./iNode";
import { BalanceCustom } from './BalanceCustom';
import * as mysql from "mysql";

function register(app) {
    app.get('/balance/list', (req, res) => {
        let mov: BalanceCustom = new BalanceCustom();
        let node: iNode = {
            request: req
            , response: res
            , mysql: mysql
            , connection: ConnectionService
            , data: null
        };
        mov.list(node);
    });
}

export { register };