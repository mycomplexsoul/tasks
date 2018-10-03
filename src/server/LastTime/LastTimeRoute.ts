import * as express from 'express';
import { iNode } from "../iNode";
import { LastTimeServer } from './LastTimeServer';

const router = express.Router();

router.get('/', (req, res) => {
    let server: LastTimeServer = new LastTimeServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.list(node);
});

router.post('/', (req, res) => {
    let server: LastTimeServer = new LastTimeServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.create(node);
});

export { router };