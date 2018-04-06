"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const fixtures_job_1 = require("./fixtures.job");
const teams_job_1 = require("./teams.job");
class Builder {
    build() {
        return new CompetitionJob(this);
    }
    get ApiClient() {
        return this.apiClient;
    }
    setApiClient(value) {
        this.apiClient = value;
        return this;
    }
    get SeasonRepo() {
        return this.seasonRepo;
    }
    setSeasonRepo(value) {
        this.seasonRepo = value;
        return this;
    }
    get TeamRepo() {
        return this.teamRepo;
    }
    setTeamRepo(value) {
        this.teamRepo = value;
        return this;
    }
    get FixtureRepo() {
        return this.fixtureRepo;
    }
    setFixtureRepo(value) {
        this.fixtureRepo = value;
        return this;
    }
    withCompetition(competitionId) {
        this.competitionId = competitionId;
        return this;
    }
    get CompetitionId() {
        return this.competitionId;
    }
}
class CompetitionJob {
    constructor(builder) {
        this.apiClient = builder.ApiClient;
        this.seasonRepo = builder.SeasonRepo;
        this.teamRepo = builder.TeamRepo;
        this.fixtureRepo = builder.FixtureRepo;
        this.competitionId = builder.CompetitionId;
    }
    static get Builder() {
        return new Builder();
    }
    start(queue) {
        console.log('** starting ApiFootballData Competition job');
        return rxjs_1.Observable.fromPromise(this.apiClient.getCompetition(this.competitionId))
            .flatMap((competitionRes) => {
            let competition = competitionRes.data;
            return this.seasonRepo.findByExternalIdAndUpdate$(competition);
        }).map(_ => {
            let fixturesJob = fixtures_job_1.FixturesJob.Builder
                .setApiClient(this.apiClient)
                .setFixtureRepo(this.fixtureRepo)
                .withCompetition(this.competitionId)
                .build();
            let teamsJob = teams_job_1.TeamsJob.Builder
                .setApiClient(this.apiClient)
                .setTeamRepo(this.teamRepo)
                .withCompetition(this.competitionId)
                .build();
            queue.addJob(fixturesJob);
            queue.addJob(teamsJob);
        }).toPromise();
    }
}
exports.CompetitionJob = CompetitionJob;
//# sourceMappingURL=competition.job.js.map