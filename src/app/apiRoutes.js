"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const league_route_1 = require("./api/league/league.route");
const router = express_1.Router();
router.get('/ping', (req, res) => {
    res.json({ pong: Date.now() });
});
router.use('/v1/leagues', league_route_1.leagueRouter.Routes);
exports.routes = router;
//# sourceMappingURL=apiRoutes.js.map