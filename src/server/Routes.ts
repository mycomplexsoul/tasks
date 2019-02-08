import * as express from 'express';
// From entities
import * as CategoryRoute from './Category/CategoryRoute';
import * as BalanceRoute from './Balance/BalanceRoute';
import * as MovementRoute from './Movement/MovementRoute';
import * as EntryRoute from './Entry/EntryRoute';
import * as AccountRoute from './Account/AccountRoute';
import * as PlaceRoute from './Place/PlaceRoute';
import * as PresetRoute from './Preset/PresetRoute';
import * as TaskRoute from './Task/TaskRoute';
import * as LastTimeRoute from './LastTime/LastTimeRoute';
import * as MultimediaRoute from './Multimedia/MultimediaRoute';
import * as MultimediaDetRoute from './MultimediaDet/MultimediaDetRoute';
import * as SyncRoute from './Sync/SyncRoute';

// Internal
import * as TypeGenerator from './TypeGenerator/TypeGeneratorRoute';

const router = express.Router();

// Routing from entities
router.use('/categories', CategoryRoute.router);
router.use('/balance', BalanceRoute.router);
router.use('/movements', MovementRoute.router);
router.use('/entries', EntryRoute.router);
router.use('/accounts', AccountRoute.router);
router.use('/places', PlaceRoute.router);
router.use('/presets', PresetRoute.router);
router.use('/tasks', TaskRoute.router);
router.use('/lasttime', LastTimeRoute.router);
router.use('/multimedia', MultimediaRoute.router);
router.use('/multimediadet', MultimediaDetRoute.router);

router.use('/sync', SyncRoute.router);

// Routing for internals
router.use('/type-generator', TypeGenerator.router);

export { router };