"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const league_router_1 = require("./api/league/league.router");
class ApiRouter {
    static create(authorization) {
        return new ApiRouter(authorization);
    }
    constructor(authorization) {
        this.router = express_1.Router();
        this.router.get('/ping', (req, res) => {
            res.json({ pong: Date.now() });
        });
        this.router.use('/v1/leagues', league_router_1.LeagueRouter.create(authorization).router);
    }
}
exports.ApiRouter = ApiRouter;
//# sourceMappingURL=api.router.js.map