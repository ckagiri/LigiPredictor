import { Router } from 'express';
import { LeagueController } from './league.controller';

let router = Router();

class LeagueRouter {
  private controller = LeagueController.getInstance();

  get Routes () {
    router.get('/', this.controller.list);
    router.get('/:id', this.controller.show)
    router.get('/:leagueId/seasons', this.controller.listSeasons); 
    return router;
  }
}

export const leagueRouter = new LeagueRouter();