import * as express from 'express';
import { iNode } from "../iNode";
import { PlaceServer } from './PlaceServer';

const router = express.Router();

router.get('/', (req, res) => {
    let server: PlaceServer = new PlaceServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.list(node);
});

router.post('/', (req, res) => {
    let server: PlaceServer = new PlaceServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.create(node);
});

export { router };