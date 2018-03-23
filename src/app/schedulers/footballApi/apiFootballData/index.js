"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const season_scheduler_1 = require("./season.scheduler");
class ApiFootballDataSchedulers {
    static getInstance() {
        return new ApiFootballDataSchedulers();
    }
    run() {
        season_scheduler_1.SeasonScheduler.getInstance().run();
    }
}
exports.ApiFootballDataSchedulers = ApiFootballDataSchedulers;
//# sourceMappingURL=index.js.map