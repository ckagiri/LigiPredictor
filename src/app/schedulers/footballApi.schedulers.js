"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const footballApiProvider_1 = require("../../common/footballApiProvider");
const season_scheduler_1 = require("./footballApi/season.scheduler");
class FootballApiSchedulers {
    static getInstance() {
        return new FootballApiSchedulers();
    }
    start() {
        season_scheduler_1.SeasonScheduler.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA).start();
    }
}
exports.FootballApiSchedulers = FootballApiSchedulers;
//# sourceMappingURL=footballApi.schedulers.js.map