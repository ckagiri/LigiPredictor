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
const taskRunner_1 = require("../taskRunner");
const apiClient_1 = require("../../../thirdParty/footballApi/apiClient");
const season_updater_1 = require("./season.updater");
const eventMediator_1 = require("../../../common/eventMediator");
const season_converter_1 = require("../../../db/converters/season.converter");
class SeasonScheduler extends events_1.EventEmitter {
    constructor(taskRunner, apiClient, seasonConverter, seasonUpdater, eventMediator) {
        super();
        this.taskRunner = taskRunner;
        this.apiClient = apiClient;
        this.seasonConverter = seasonConverter;
        this.seasonUpdater = seasonUpdater;
        this.eventMediator = eventMediator;
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
                        yield this.seasonUpdater.updateCurrentMatchRound(competitions);
                        this._pollingInterval = this.POLLING_INTERVAL;
                        this.onTaskExecuted();
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
        this.onTaskExecuted = () => {
            this.emit('task:executed');
        };
    }
    static getInstance(provider) {
        return new SeasonScheduler(new taskRunner_1.TaskRunner(), apiClient_1.FootballApiClient.getInstance(provider), season_converter_1.SeasonConverter.getInstance(provider), season_updater_1.SeasonUpdater.getInstance(provider), eventMediator_1.EventMediator.getInstance());
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