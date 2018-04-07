"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const footballApiProvider_1 = require("../../../common/footballApiProvider");
const season_repo_1 = require("../../repositories/season.repo");
const team_repo_1 = require("../../repositories/team.repo");
class FixtureConverter {
    constructor(seasonRepo, teamRepo) {
        this.seasonRepo = seasonRepo;
        this.teamRepo = teamRepo;
        this.provider = footballApiProvider_1.FootballApiProvider.LIGI;
    }
    static getInstance() {
        return new FixtureConverter(season_repo_1.SeasonRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI), team_repo_1.TeamRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI));
    }
    from(data) {
        return rxjs_1.Observable.zip(this.seasonRepo.findById$(data.seasonId), this.teamRepo.findById$(data.homeTeamId), this.teamRepo.findById$(data.awayTeamId), (season, homeTeam, awayTeam) => {
            return {
                season: season._id,
                date: new Date(data.date),
                matchRound: data.matchRound,
                gameRound: data.gameRound,
                status: data.status,
                homeTeam: {
                    slug: homeTeam.slug,
                    name: homeTeam.name,
                    id: homeTeam._id,
                    crestUrl: homeTeam.crestUrl
                },
                awayTeam: {
                    slug: awayTeam.slug,
                    name: awayTeam.name,
                    id: awayTeam._id,
                    crestUrl: awayTeam.crestUrl
                },
                slug: `${homeTeam.slug}-${awayTeam.slug}`,
                result: {
                    goalsHomeTeam: data.result.goalsHomeTeam,
                    goalsAwayTeam: data.result.goalsAwayTeam
                },
                odds: data.odds
            };
        });
    }
    map(data) {
        return data;
    }
}
exports.FixtureConverter = FixtureConverter;
//# sourceMappingURL=fixture.converter.js.map