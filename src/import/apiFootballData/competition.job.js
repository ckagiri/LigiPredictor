"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompetitionJob {
    constructor(competition, apiClient) {
        this.competition = competition;
        this.apiClient = apiClient;
    }
    start(queue) {
        throw new Error("Method not implemented.");
    }
}
exports.CompetitionJob = CompetitionJob;
//# sourceMappingURL=competition.job.js.map