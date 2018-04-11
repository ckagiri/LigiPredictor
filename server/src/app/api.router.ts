import { Router } from 'express';

import { LeagueRouter } from './api/league/league.router';
import { IAuthorization } from './authorization';

export class ApiRouter {
  public router: Router;

  static create(authorization: IAuthorization) {
    return new ApiRouter(authorization);
  }

  constructor(authorization: IAuthorization) {
    this.router = Router();
    this.router.get('/ping', (req, res) => {
      res.json({ pong: Date.now() })
    });
    
    this.router.use('/v1/leagues', LeagueRouter.create(authorization).router);
  }
}

