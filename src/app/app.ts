import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as favicon from 'serve-favicon';

import { IAuthorization, Authorization } from './authorization';
import { router as apiRouter } from './apiRoutes';

class ExpressApp {
  private express: express.Application;

  static create(): express.Application {
    return new ExpressApp(new Authorization()).express;
  }

  constructor(authorization: IAuthorization) {
    this.express = express();
    this.middleware();
    authorization.init(this.express);
    this.routes(authorization);
  }

  private middleware() {
    this.express.disable('etag');
    this.express.use(this.nocache);
    this.express.use(logger('dev'));
    this.express.use(favicon(__dirname + '/favicon.ico'));    
    this.express.use(bodyParser.json({ limit: '50mb' }));
    this.express.use(bodyParser.urlencoded({ extended: true }));

  }

  private nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  }

  private routes(authorization: IAuthorization) {
    this.express.use('/auth/v1', authorization.router);
    this.express.use('/api', apiRouter);    
  }
}

export const App = { create: () => ExpressApp.create() };
export default App;