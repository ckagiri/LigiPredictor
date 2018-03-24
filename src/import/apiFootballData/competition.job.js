"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const fixtures_job_1 = require("./fixtures.job");
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
        let competitionObs = rxjs_1.Observable.fromPromise(this.apiClient.getCompetition(this.competitionId))
            .flatMap((competitionRes) => {
            let competition = competitionRes.data;
            return this.seasonRepo.findByExternalIdAndUpdate$(competition);
        });
        let teamsObs = rxjs_1.Observable.fromPromise(this.apiClient.getTeams(this.competitionId))
            .flatMap((teamsRes) => {
            let teams = teamsRes.data.teams;
            return this.teamRepo.findByNameAndUpdate$(teams);
        });
        return rxjs_1.Observable.zip(competitionObs, teamsObs, (competition, teams) => {
            return { competition, teams };
        })
            .map(_ => {
            let jobBuilder = fixtures_job_1.FixturesJob.Builder;
            let job = jobBuilder
                .setApiClient(this.apiClient)
                .setFixtureRepo(this.fixtureRepo)
                .withCompetition(this.competitionId)
                .build();
            queue.addJob(job);
        }).toPromise();
    }
}
exports.CompetitionJob = CompetitionJob;
//# sourceMappingURL=competition.job.js.map