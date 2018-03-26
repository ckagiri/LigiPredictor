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
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
const season_scheduler_1 = require("../../src/app/schedulers/footballApi/apiFootballData/season.scheduler");
let taskRunnerStub = {
    run: ({ whenToExecute, task = () => { }, context }) => __awaiter(this, void 0, void 0, function* () {
        yield task.call(context);
    })
};
let apiClientStub = {
    getCompetitions: () => { return Promise.resolve(); }
};
let seasonUpdaterStub = {
    updateCurrentMatchRound: () => { return Promise.resolve(); }
};
let seasonScheduler;
describe('ApiFootballData: Season scheduler', () => {
    beforeEach(() => {
        seasonScheduler = new season_scheduler_1.SeasonScheduler(taskRunnerStub, apiClientStub, seasonUpdaterStub);
    });
    describe('start', () => {
        const POLLING_INTERVAL = 24 * 60 * 60 * 1000;
        it('should set polling true/false when started/stopped respectively', (done) => {
            seasonScheduler.start();
            expect(seasonScheduler.IsPolling).to.be.true;
            seasonScheduler.stop();
            seasonScheduler.on('stopped', () => {
                expect(seasonScheduler.IsPolling).to.be.false;
                done();
            });
        });
        it('should run again after polling interval', (done) => {
            let clock = sinon.useFakeTimers();
            let spy = sinon.spy(seasonScheduler, 'onTaskExecuted');
            let count = 0;
            seasonScheduler.start();
            seasonScheduler.on('task:executed', () => {
                count += 1;
                if (count == 2) {
                    seasonScheduler.stop();
                }
            });
            seasonScheduler.on('stopped', () => {
                expect(spy).to.have.callCount(2);
                expect(seasonScheduler.PollingInterval).to.equal(POLLING_INTERVAL); //24hours      
                done();
            });
            clock.restore();
        });
        it('should getCompetitions from apiClient', (done) => {
            let clock = sinon.useFakeTimers();
            let spy = sinon.spy(apiClientStub, 'getCompetitions');
            seasonScheduler.start();
            seasonScheduler.on('task:executed', () => {
                seasonScheduler.stop();
            });
            seasonScheduler.on('stopped', () => {
                expect(spy).to.have.been.called;
                done();
            });
            clock.restore();
        });
        it('should update seasons', (done) => {
            let clock = sinon.useFakeTimers();
            let spy = sinon.spy(seasonUpdaterStub, 'updateCurrentMatchRound');
            seasonScheduler.start();
            seasonScheduler.on('task:executed', () => {
                seasonScheduler.stop();
            });
            seasonScheduler.on('stopped', () => {
                expect(spy).to.have.been.called;
                done();
            });
            clock.restore();
        });
    });
});
//# sourceMappingURL=season.scheduler.spec.js.map