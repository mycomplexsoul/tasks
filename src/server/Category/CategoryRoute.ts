import * as express from 'express';
import ConnectionService from '../ConnectionService';
import { iNode } from "../iNode";
import { CategoryServer } from './CategoryServer';
import * as mysql from "mysql";

const router = express.Router();
/*

 */
router.get('/', (req, res) => {
    let server: CategoryServer = new CategoryServer();
    let node: iNode = {
        request: req
        , response: res
        , mysql: mysql
        , connection: ConnectionService
        , data: null
    };
    server.list(node);
});

export { router };