import * as express from 'express';
import { iNode } from "../iNode";
import { SyncCustom } from './SyncCustom';

const router = express.Router();

router.post('/', (req, res) => {
    let server: SyncCustom = new SyncCustom();
    let node: iNode = {
        request: req
        , response: res
    };
    server.syncAll(node);
});

export { router };