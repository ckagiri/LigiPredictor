"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        throw new Error("Method not implemented.");
    }
}
exports.FixturesJob = FixturesJob;
//# sourceMappingURL=fixtures.job.js.map