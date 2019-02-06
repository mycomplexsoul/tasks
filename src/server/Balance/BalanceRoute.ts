import * as express from 'express';
import { iNode } from "../iNode";
import { BalanceServer } from './BalanceServer';

const router = express.Router();

router.get('/', (req, res) => {
    const server: BalanceServer = new BalanceServer();
    const node: iNode = {
        request: req
        , response: res
    };
    server.list(node);
});

router.post('/rebuild', (req, res) => {
    const server: BalanceServer = new BalanceServer();

    server.rebuild(req, res);
});

/**
 * /api/balance/transfer?year=2019&month=1&user=anon
 */
router.post('/transfer', (req, res) => {
    const server: BalanceServer = new BalanceServer();

    server.transfer(req, res);
});

router.post('/rebuild-and-transfer', (req, res) => {
    const server: BalanceServer = new BalanceServer();

    server.rebuildAndTransfer(req, res);
});

/**
 * /api/balance/rebuild-and-transfer-range?year=2018&month=12&user=anon
 */
router.get('/rebuild-and-transfer-range', (req, res) => {
    const server: BalanceServer = new BalanceServer();

    server.rebuildAndTransferRange(req, res);
});

export { router };