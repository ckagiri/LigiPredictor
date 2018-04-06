"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class Builder {
    build() {
        return new TeamsJob(this);
    }
    get ApiClient() {
        return this.apiClient;
    }
    setApiClient(value) {
        this.apiClient = value;
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
    get CompetitionId() {
        return this.competitionId;
    }
}
class TeamsJob {
    constructor(builder) {
        this.apiClient = builder.ApiClient;
        this.teamRepo = builder.TeamRepo;
        this.competitionId = builder.CompetitionId;
    }
    static get Builder() {
        return new Builder();
    }
    start(queue) {
        console.log('** starting ApiFootballData Teams job');
        return rxjs_1.Observable.fromPromise(this.apiClient.getTeams(this.competitionId))
            .flatMap((teamsRes) => {
            let teams = teamsRes.data.teams;
            return this.teamRepo.findEachByNameAndUpdate$(teams);
        }).toPromise();
    }
}
exports.TeamsJob = TeamsJob;
//# sourceMappingURL=teams.job.js.map