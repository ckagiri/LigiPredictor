import { Router } from 'express';

import { IAuthorization } from '../../authorization';
import { LeagueController } from './league.controller';

export class LeagueRouter {
  private controller: LeagueController;
  public router: Router;

  static create(authorization: IAuthorization) {
    return new LeagueRouter(authorization, LeagueController.getInstance());
  }

  constructor(authorization: IAuthorization, leagueController: LeagueController) {
    this.router = Router();    
    this.controller = leagueController;

    this.router.get('/', this.controller.list);
    this.router.get('/:id', this.controller.show)
    this.router.get('/:leagueId/seasons', this.controller.listSeasons); 
  }
}