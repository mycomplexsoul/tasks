import * as express from 'express';
import * as CategoryRoute from './Category/CategoryRoute';
import * as BalanceRoute from './Balance/BalanceRoute';
const router = express.Router();

router.use('/categories', CategoryRoute.router);
router.use('/balance', BalanceRoute.router);

export { router };