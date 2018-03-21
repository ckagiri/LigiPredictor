"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const league_repo_1 = require("../db/repositories/league.repo");
class LeagueService {
    constructor(leagueRepo) {
        this.leagueRepo = leagueRepo;
    }
    static getInstance(provider) {
        return new LeagueService(league_repo_1.LeagueRepository.getInstance(provider));
    }
    save$(data) {
        return this.leagueRepo.save$(data);
    }
}
exports.LeagueService = LeagueService;
//# sourceMappingURL=league.service.js.map