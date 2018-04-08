"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const league_controller_1 = require("./league.controller");
class LeagueRouter {
    static create(authorization) {
        return new LeagueRouter(authorization);
    }
    constructor(authorization) {
        this.router = express_1.Router();
        this.controller = league_controller_1.LeagueController.getInstance();
        this.router.get('/', this.controller.list);
        this.router.get('/:id', this.controller.show);
        this.router.get('/:leagueId/seasons', this.controller.listSeasons);
    }
}
exports.LeagueRouter = LeagueRouter;
//# sourceMappingURL=league.router.js.map