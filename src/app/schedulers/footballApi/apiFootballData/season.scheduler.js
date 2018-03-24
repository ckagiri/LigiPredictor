"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_scheduler_1 = require("../../simple.scheduler");
class SeasonScheduler extends simple_scheduler_1.SimpleScheduler {
    static getInstance() {
        return new SeasonScheduler();
    }
    constructor() {
        super();
        this.run = this.run.bind(this);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.SeasonScheduler = SeasonScheduler;
//# sourceMappingURL=season.scheduler.js.map