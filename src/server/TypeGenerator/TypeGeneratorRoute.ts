import * as express from 'express';
import { iNode } from "../iNode";
import { TypeGeneratorServer } from './TypeGeneratorServer';

const router = express.Router();
/*

 */
router.get('/config', (req, res) => {
    let server: TypeGeneratorServer = new TypeGeneratorServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.config(node);
});

router.post('/create', (req, res) => {
    let server: TypeGeneratorServer = new TypeGeneratorServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.create(node);
});

router.post('/check', (req, res) => {
    let server: TypeGeneratorServer = new TypeGeneratorServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.check(node);
});

export { router };