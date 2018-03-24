"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const competition_job_1 = require("./competition.job");
const footballApiProvider_1 = require("../../common/footballApiProvider");
const apiClient_1 = require("../../thirdParty/footballApi/apiClient");
const season_repo_1 = require("../../db/repositories/season.repo");
const team_repo_1 = require("../../db/repositories/team.repo");
const fixture_repo_1 = require("../../db/repositories/fixture.repo");
class MainJob {
    constructor(apiClient, seasonRepo, teamRepo, fixtureRepo) {
        this.apiClient = apiClient;
        this.seasonRepo = seasonRepo;
        this.teamRepo = teamRepo;
        this.fixtureRepo = fixtureRepo;
    }
    static getInstance() {
        return new MainJob(apiClient_1.FootballApiClient.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA), season_repo_1.SeasonRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA), team_repo_1.TeamRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA), fixture_repo_1.FixtureRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA));
    }
    start(queue) {
        return this.apiClient.getCompetitions(2017).then(({ data: competitions }) => {
            for (let comp of competitions) {
                if (comp.id !== 445) {
                    continue;
                }
                let competition = { id: comp.id, caption: comp.caption };
                let jobBuilder = competition_job_1.CompetitionJob.Builder;
                let job = jobBuilder
                    .setApiClient(this.apiClient)
                    .setSeasonRepo(this.seasonRepo)
                    .setTeamRepo(this.teamRepo)
                    .setFixtureRepo(this.fixtureRepo)
                    .withCompetition(comp.id)
                    .build();
                queue.addJob(job);
            }
        }).catch((err) => {
            let message = err.message || 'Something went wrong!';
            throw new Error(err);
        });
    }
}
exports.MainJob = MainJob;
//# sourceMappingURL=main.job.js.map