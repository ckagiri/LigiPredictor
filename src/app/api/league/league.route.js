"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const league_controller_1 = require("./league.controller");
let router = express_1.Router();
class LeagueRouter {
    constructor() {
        this.controller = league_controller_1.LeagueController.getInstance();
    }
    get routes() {
        router.get('/', this.controller.list);
        router.get('/:id', this.controller.show);
        router.get('/:leagueId/seasons', this.controller.listSeasons);
        return router;
    }
}
exports.leagueRouter = new LeagueRouter();
//# sourceMappingURL=league.route.js.map