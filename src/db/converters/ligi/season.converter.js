"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const league_repo_1 = require("../../repositories/league.repo");
const footballApiProvider_1 = require("../../../common/footballApiProvider");
class SeasonConverter {
    constructor(leagueRepo) {
        this.leagueRepo = leagueRepo;
        this.provider = footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA;
    }
    static getInstance() {
        return new SeasonConverter(league_repo_1.LeagueRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA));
    }
    from(data) {
        return this.leagueRepo.findById$(data.leagueId)
            .flatMap((league) => {
            return rxjs_1.Observable.of({
                league: {
                    id: league['_id'],
                    name: league.name,
                    slug: league.slug
                },
                name: data.name,
                slug: data.slug,
                year: data.year,
                seasonStart: data.seasonStart,
                seasonEnd: data.seasonEnd,
                currentGameRound: data.currentGameRound,
                currentMatchRound: data.currentMatchRound
            });
        });
    }
}
exports.SeasonConverter = SeasonConverter;
//# sourceMappingURL=season.converter.js.map