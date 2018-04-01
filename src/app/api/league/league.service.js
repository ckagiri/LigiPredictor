"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const league_repo_1 = require("../../../db/repositories/league.repo");
const season_repo_1 = require("../../../db/repositories/season.repo");
const footballApiProvider_1 = require("../../../common/footballApiProvider");
const isMongoId_1 = require("../../utils/isMongoId");
class LeagueService {
    constructor(leagueRepo, seasonRepo) {
        this.leagueRepo = leagueRepo;
        this.seasonRepo = seasonRepo;
    }
    static getInstance(provider = footballApiProvider_1.FootballApiProvider.LIGI) {
        return new LeagueService(league_repo_1.LeagueRepository.getInstance(provider), season_repo_1.SeasonRepository.getInstance(provider));
    }
    getAllLeagues$() {
        return this.leagueRepo.findAll$();
    }
    getLeagueById$(id) {
        if (isMongoId_1.default(id)) {
            return this.leagueRepo.findById$(id);
        }
        else {
            return this.leagueRepo.findOne$({ slug: id });
        }
    }
    getAllSeasonsByLeague$(leagueId) {
        return this.seasonRepo.findAll$({ league: leagueId });
    }
}
exports.LeagueService = LeagueService;
//# sourceMappingURL=league.service.js.map