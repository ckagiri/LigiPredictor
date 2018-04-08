"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const league_route_1 = require("./api/league/league.route");
exports.router = express_1.Router();
exports.router.get('/ping', (req, res) => {
    res.json({ pong: Date.now() });
});
exports.router.use('/v1/leagues', league_route_1.leagueRouter.router);
//# sourceMappingURL=apiRoutes.js.map