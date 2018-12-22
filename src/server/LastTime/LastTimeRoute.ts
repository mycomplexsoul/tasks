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

router.post('/:lst_id', (req, res) => {
    let server: LastTimeServer = new LastTimeServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.update(node);
});

router.get('/backup', (req, res) => {
    let server: LastTimeServer = new LastTimeServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.backupLastTimeData(node);
});

router.get('/cleanup', (req, res) => {
    let server: LastTimeServer = new LastTimeServer();
    let node: iNode = {
        request: req
        , response: res
    };
    server.cleanUpData(node);
});

export { router };