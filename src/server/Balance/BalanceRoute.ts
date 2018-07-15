import * as express from 'express';
import { iNode } from "../iNode";
import { BalanceServer } from './BalanceServer';

const router = express.Router();

router.get('/', (req, res) => {
    let server: BalanceServer = new BalanceServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.list(node);
});

export { router };