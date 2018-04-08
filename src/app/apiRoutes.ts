import { Router } from 'express';

import { leagueRouter } from './api/league/league.route';

export const router = Router();

router.get('/ping', (req, res) => {
  res.json({ pong: Date.now() })
});

router.use('/v1/leagues', leagueRouter.router);