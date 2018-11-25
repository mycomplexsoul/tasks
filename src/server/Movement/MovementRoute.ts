import * as express from 'express';
import { iNode } from "../iNode";
import { MovementCustom } from './MovementCustom';

const router = express.Router();

router.get('/', (req, res) => {
    const server: MovementCustom = new MovementCustom();
    const node: iNode = {
        request: req
        , response: res
    };
    server.list(node);
});

router.get('/import', (req, res) => {
    const mov: MovementCustom = new MovementCustom();
    const node: iNode = {
        request: req
        , response: res
    };
    mov.import(node);
});

router.post('/', (req, res) => {
    const mov: MovementCustom = new MovementCustom();
    const node: iNode = {
        request: req
        , response: res
    };
    mov.create(node);
});

router.post('/:mov_id', (req, res) => {
    const mov: MovementCustom = new MovementCustom();
    const node: iNode = {
        request: req
        , response: res
    };
    mov.update(node);
});

router.get('/generate-entries', (req, res) => {
    const mov: MovementCustom = new MovementCustom();
    const node: iNode = {
        request: req
        , response: res
    };
    mov._generateEntries(node);
});

router.get('/generate-balance', (req, res) => {
    const mov: MovementCustom = new MovementCustom();
    const node: iNode = {
        request: req
        , response: res
    };
    //mov.generateBalance(node);
    mov.rebuildAndTransfer();
    res.end(JSON.stringify({operationOk: true, message: `Batch finished, inserted ok`}));
});

router.get('/accounts', (req, res) => {
    const server: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
    };
    server.accountsWithBalance(node);
});

/**
 * Average balance.
 * Example: /api/movements/average-balance?account=3&checkday=true&year=2018&month=11
 */
router.get('/average-balance', (req, res) => {
    const server: MovementCustom = new MovementCustom();
    const node: iNode = {
        request: req
        , response: res
    };
    server.averageBalance(node);
});

/**
 * Send account movements for a specified account/year/month in an email.
 * Example: /api/movements/email-account-movements?account=11&year=2018&month=11
 */
router.get('/email-account-movements', (req, res) => {
    const server: MovementCustom = new MovementCustom();
    
    server.emailAccountMovements(req, res);
});

export { router };