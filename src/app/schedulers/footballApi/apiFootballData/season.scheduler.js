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
const events_1 = require("events");
const taskRunner_1 = require("../../taskRunner");
const apiClient_1 = require("../../../../thirdParty/footballApi/apiClient");
const season_updater_1 = require("../processors/season.updater");
class SeasonScheduler extends events_1.EventEmitter {
    constructor(taskRunner, apiClient, seasonUpdater) {
        super();
        this.taskRunner = taskRunner;
        this.apiClient = apiClient;
        this.seasonUpdater = seasonUpdater;
        this.POLLING_INTERVAL = 24 * 60 * 60 * 1000;
        this._pollingInterval = 0;
        this._polling = false;
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            this._polling = true;
            while (this._polling) {
                yield this.taskRunner.run({
                    whenToExecute: this._pollingInterval,
                    context: this,
                    task: () => __awaiter(this, void 0, void 0, function* () {
                        let competitions = yield this.apiClient.getCompetitions(2017);
                        yield this.seasonUpdater.updateSeasons(competitions);
                        this._pollingInterval = this.POLLING_INTERVAL;
                        this.onTaskEnd();
                    })
                });
            }
        });
        this.stop = () => __awaiter(this, void 0, void 0, function* () {
            yield Promise.resolve().then(() => {
                this._polling = false;
                this.emit('stopped');
            });
        });
        this.onTaskEnd = () => {
            this.emit('task:end');
        };
    }
    static getInstance(provider) {
        return new SeasonScheduler(new taskRunner_1.TaskRunner(), apiClient_1.FootballApiClient.getInstance(provider), season_updater_1.SeasonUpdater.getInstance(provider));
    }
    get IsPolling() {
        return this._polling;
    }
    get PollingInterval() {
        return this._pollingInterval;
    }
}
exports.SeasonScheduler = SeasonScheduler;
//# sourceMappingURL=season.scheduler.js.map