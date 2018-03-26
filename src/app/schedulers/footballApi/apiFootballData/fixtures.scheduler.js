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
let Moment = require('moment');
const taskRunner_1 = require("../../taskRunner");
const apiClient_1 = require("../../../../thirdParty/footballApi/apiClient");
const fixtures_updater_1 = require("../processors/fixtures.updater");
const finishedFixtures_processor_1 = require("../processors/finishedFixtures.processor");
class FixturesScheduler extends events_1.EventEmitter {
    constructor(taskRunner, apiClient, fixturesUpdater, finishedFixturesUpdater) {
        super();
        this.taskRunner = taskRunner;
        this.apiClient = apiClient;
        this.fixturesUpdater = fixturesUpdater;
        this.finishedFixturesUpdater = finishedFixturesUpdater;
        this._nextUpdate = 0;
        this._previousUpdate = 0;
        this._polling = false;
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            this._polling = true;
            while (this._polling) {
                yield this.taskRunner.run({
                    whenToExecute: this._nextUpdate,
                    context: this,
                    task: () => __awaiter(this, void 0, void 0, function* () {
                        let fixtures = [];
                        if (this._nextUpdate > (6 * 60 * 60 * 1000)) {
                            let tommorowsFixtures = yield this.apiClient.getTomorrowsFixtures();
                            let yesterdaysFixtures = yield this.apiClient.getYesterdaysFixtures();
                            fixtures = [].concat(...[tommorowsFixtures, yesterdaysFixtures]);
                        }
                        let todaysFixtures = yield this.apiClient.getTodaysFixtures();
                        fixtures = fixtures.concat(todaysFixtures);
                        let changedDbFixtures = yield this.fixturesUpdater.updateFixtures(fixtures);
                        this._previousUpdate = this._nextUpdate;
                        this._nextUpdate = this.calculateNextUpdate(fixtures);
                        this.emit('process:fixtures', changedDbFixtures);
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
        this.calculateNextUpdate = (fixtures) => {
            return 10 * 60 * 60 * 1000;
        };
        this.processFixtures = (changedDbFixtures) => __awaiter(this, void 0, void 0, function* () {
            yield Promise.resolve();
        });
        this.on('process:fixtures', this.processFixtures);
    }
    static getInstance(provider) {
        return new FixturesScheduler(new taskRunner_1.TaskRunner(), apiClient_1.FootballApiClient.getInstance(provider), fixtures_updater_1.FixturesUpdater.getInstance(provider), finishedFixtures_processor_1.FinishedFixturesProcessor.getInstance());
    }
    get IsPolling() {
        return this._polling;
    }
    get NextUpdate() {
        return this._nextUpdate;
    }
    get PreviousUpdate() {
        return this._previousUpdate;
    }
}
exports.FixturesScheduler = FixturesScheduler;
//# sourceMappingURL=fixtures.scheduler.js.map