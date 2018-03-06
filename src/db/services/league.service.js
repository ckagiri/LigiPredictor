"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LeagueService {
    constructor(leagueRepo, leagueConverter) {
        this.leagueRepo = leagueRepo;
        this.leagueConverter = leagueConverter;
    }
    save$(data) {
        return this.leagueConverter.convert(data)
            .flatMap((obj) => {
            return this.leagueRepo.save$(obj);
        });
    }
}
exports.LeagueService = LeagueService;
//# sourceMappingURL=league.service.js.map