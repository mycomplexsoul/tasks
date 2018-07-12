import * as express from 'express';
import * as CategoryRoute from './Category/CategoryRoute';
const router = express.Router();

router.use('/categories', CategoryRoute.router);

export { router };