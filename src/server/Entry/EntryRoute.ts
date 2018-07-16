import * as express from 'express';
import { iNode } from "../iNode";
import { EntryServer } from './EntryServer';

const router = express.Router();

router.get('/', (req, res) => {
    let server: EntryServer = new EntryServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.list(node);
});

export { router };