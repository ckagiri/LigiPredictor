"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const footballApiProvider_1 = require("../../../../common/footballApiProvider");
const season_scheduler_1 = require("./season.scheduler");
class ApiFootballDataSchedulers {
    static getInstance() {
        return new ApiFootballDataSchedulers();
    }
    start() {
        season_scheduler_1.SeasonScheduler.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA).start();
    }
}
exports.ApiFootballDataSchedulers = ApiFootballDataSchedulers;
//# sourceMappingURL=index.js.map