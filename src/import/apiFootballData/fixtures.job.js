"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class Builder {
    build() {
        return new FixturesJob(this);
    }
    get ApiClient() {
        return this.apiClient;
    }
    setApiClient(value) {
        this.apiClient = value;
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
class FixturesJob {
    constructor(builder) {
        this.apiClient = builder.ApiClient;
        this.fixtureRepo = builder.FixtureRepo;
        this.competitionId = builder.CompetitionId;
    }
    static get Builder() {
        return new Builder();
    }
    start(queue) {
        console.log('** starting ApiFootballData Fixtures job');
        return rxjs_1.Observable.fromPromise(this.apiClient.getFixtures(this.competitionId))
            .flatMap((fixturesRes) => {
            let fixtures = fixturesRes.data.fixtures;
            return this.fixtureRepo.findEachBySeasonAndSlugAndUpdate$(fixtures);
        }).toPromise();
    }
}
exports.FixturesJob = FixturesJob;
//# sourceMappingURL=fixtures.job.js.map