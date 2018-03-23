"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const season_scheduler_1 = require("./season.scheduler");
class ApiFootballDataSchedulerFactory {
    static getInstance() {
        return new ApiFootballDataSchedulerFactory();
    }
    makeSeasonScheduler() {
        return new season_scheduler_1.SeasonScheduler();
    }
}
exports.ApiFootballDataSchedulerFactory = ApiFootballDataSchedulerFactory;
//# sourceMappingURL=index.js.map