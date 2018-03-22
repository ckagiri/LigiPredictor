"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiClient_1 = require("../../thirdParty/footballApi/apiClient");
const competition_job_1 = require("./competition.job");
const footballApiProvider_1 = require("../../common/footballApiProvider");
class MainJob {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    static getInstance() {
        return new MainJob(apiClient_1.FootballApiClient.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA));
    }
    start(queue) {
        return this.apiClient.getCompetitions(2017).then(({ data: competitions }) => {
            for (let comp of competitions) {
                if (comp.id !== 445) {
                    continue;
                }
                let competition = { id: comp.id, caption: comp.caption };
                let jobBuilder = competition_job_1.CompetitionJob.Builder;
                let job = jobBuilder.withCompetition(445).build();
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