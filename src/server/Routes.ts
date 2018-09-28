import * as express from 'express';
import * as CategoryRoute from './Category/CategoryRoute';
import * as BalanceRoute from './Balance/BalanceRoute';
import * as MovementRoute from './Movement/MovementRoute';
import * as EntryRoute from './Entry/EntryRoute';
import * as AccountRoute from './Account/AccountRoute';
import * as PlaceRoute from './Place/PlaceRoute';
import * as PresetRoute from './Preset/PresetRoute';
import * as TaskRoute from './Task/TaskRoute';
const router = express.Router();

router.use('/categories', CategoryRoute.router);
router.use('/balance', BalanceRoute.router);
router.use('/movements', MovementRoute.router);
router.use('/entries', EntryRoute.router);
router.use('/accounts', AccountRoute.router);
router.use('/places', PlaceRoute.router);
router.use('/presets', PresetRoute.router);
router.use('/tasks', TaskRoute.router);

export { router };