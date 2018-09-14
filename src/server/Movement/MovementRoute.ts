import * as express from 'express';
import { iNode } from "../iNode";
import { MovementCustom } from './MovementCustom';

const router = express.Router();

router.get('/', (req, res) => {
    let server: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
    };
    server.list(node);
});

router.get('/import', (req, res) => {
    let mov: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
    };
    mov.import(node);
});

router.post('/', (req, res) => {
    let mov: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
    };
    mov.create(node);
});

router.post('/:mov_id', (req, res) => {
    let mov: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
    };
    mov.update(node);
});

router.get('/generate-entries', (req, res) => {
    let mov: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
    };
    mov._generateEntries(node);
});

router.get('/generate-balance', (req, res) => {
    let mov: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
    };
    //mov.generateBalance(node);
    mov.rebuildAndTransfer();
    res.end(JSON.stringify({operationOk: true, message: `Batch finished, inserted ok`}));
});

router.get('/accounts', (req, res) => {
    let server: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
    };
    server.accountsWithBalance(node);
});

export { router };