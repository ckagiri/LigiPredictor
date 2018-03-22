"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Builder {
    constructor() { }
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
    withCompetition(competitionId) {
        this.competitionId = competitionId;
        return this;
    }
}
class CompetitionJob {
    constructor(builder) {
        this.apiClient = builder.ApiClient;
        this.seasonRepo = builder.SeasonRepo;
        this.teamRepo = builder.TeamRepo;
    }
    static get Builder() {
        return new Builder();
    }
    start(queue) {
        throw new Error("Method not implemented.");
    }
}
exports.CompetitionJob = CompetitionJob;
//# sourceMappingURL=competition.job.js.map