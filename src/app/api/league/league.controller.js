"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const league_service_1 = require("./league.service");
class LeagueController {
    constructor(leagueService) {
        this.leagueService = leagueService;
        this.list = (req, res) => {
            this.leagueService.getAllLeagues$()
                .subscribe(leagues => {
                res.status(200).json(leagues);
            }, err => {
                res.status(500).json(err);
            });
        };
        this.show = (req, res) => {
            let id = req.params.id;
            this.leagueService.getLeagueById$(id)
                .subscribe(league => {
                res.status(200).json(league);
            }, (err) => {
                res.status(500).json(err);
            });
        };
        this.listSeasons = (req, res) => {
            let leagueId = req.params.leagueId;
            this.leagueService.getAllSeasonsByLeague$(leagueId)
                .subscribe((seasons) => {
                res.status(200).json(seasons);
            }, (err) => {
                res.status(500).json(err);
            });
        };
    }
    static getInstance() {
        return new LeagueController(league_service_1.LeagueService.getInstance());
    }
}
exports.LeagueController = LeagueController;
//# sourceMappingURL=league.controller.js.map