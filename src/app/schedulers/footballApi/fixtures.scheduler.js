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
let moment = require('moment');
const taskRunner_1 = require("../taskRunner");
const apiClient_1 = require("../../../thirdParty/footballApi/apiClient");
const eventMediator_1 = require("../../../common/eventMediator");
const fixture_converter_1 = require("../../../db/converters/fixture.converter");
const fixture_model_1 = require("../../../db/models/fixture.model");
const fixtures_updater_1 = require("./fixtures.updater");
class FixturesScheduler extends events_1.EventEmitter {
    constructor(taskRunner, apiClient, fixtureConverter, fixturesUpdater, eventMedidatior) {
        super();
        this.taskRunner = taskRunner;
        this.apiClient = apiClient;
        this.fixtureConverter = fixtureConverter;
        this.fixturesUpdater = fixturesUpdater;
        this.eventMedidatior = eventMedidatior;
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
                            let tommorowsFixturesRes = yield this.apiClient.getTomorrowsFixtures();
                            let tommorowsFixtures = this.fixtureConverter.map(tommorowsFixturesRes.data.fixtures);
                            let yesterdaysFixturesRes = yield this.apiClient.getYesterdaysFixtures();
                            let yesterdaysFixtures = this.fixtureConverter.map(yesterdaysFixturesRes.data.fixtures);
                            fixtures = [].concat(...[tommorowsFixtures, yesterdaysFixtures]);
                        }
                        let todaysFixturesRes = yield this.apiClient.getTodaysFixtures();
                        let todaysFixtures = this.fixtureConverter.map(todaysFixturesRes.data.fixtures);
                        fixtures = fixtures.concat(todaysFixtures);
                        let changedDbFixtures = yield this.fixturesUpdater.updateGameDetails(fixtures);
                        this._previousUpdate = this._nextUpdate;
                        this._nextUpdate = this.calculateNextUpdate(fixtures);
                        let finishedFixtures = [].filter.call(changedDbFixtures, n => n.status == fixture_model_1.FixtureStatus.FINISHED);
                        this.eventMedidatior.publish('process:predictions', finishedFixtures);
                        this.emit('task:executed');
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
        this.calculateNextUpdate = (fixtureList) => {
            let nextUpdate = moment().add(12, 'hours');
            let fixtures = fixtureList.filter(f => f.status !== fixture_model_1.FixtureStatus.FINISHED);
            let hasLiveFixture = false;
            for (let fixture of fixtures) {
                if (fixture.status == fixture_model_1.FixtureStatus.IN_PLAY) {
                    hasLiveFixture = true;
                }
                if (fixture.status == fixture_model_1.FixtureStatus.SCHEDULED || fixture.status == fixture_model_1.FixtureStatus.TIMED) {
                    let fixtureStart = moment(fixture.date);
                    const diff = fixtureStart.diff(moment(), 'minutes');
                    if (diff <= 5) {
                        hasLiveFixture = true;
                    }
                    if (fixtureStart.isAfter(moment()) && fixtureStart.isBefore(nextUpdate)) {
                        nextUpdate = fixtureStart;
                    }
                }
            }
            if (hasLiveFixture) {
                nextUpdate = moment().add(90, 'seconds');
            }
            return nextUpdate - moment();
        };
    }
    static getInstance(provider) {
        return new FixturesScheduler(new taskRunner_1.TaskRunner(), apiClient_1.FootballApiClient.getInstance(provider), fixture_converter_1.FixtureConverter.getInstance(provider), fixtures_updater_1.FixturesUpdater.getInstance(provider), eventMediator_1.EventMediator.getInstance());
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