"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_scheduler_1 = require("../../simple.scheduler");
class SeasonScheduler extends simple_scheduler_1.SimpleScheduler {
    static getInstance() {
        return new SeasonScheduler();
    }
    run() {
        throw new Error("Method not implemented.");
    }
}
exports.SeasonScheduler = SeasonScheduler;
//# sourceMappingURL=season.scheduler.js.map