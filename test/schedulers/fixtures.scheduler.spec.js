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
const fixtures_scheduler_1 = require("../../src/app/schedulers/footballApi/apiFootballData/fixtures.scheduler");
let taskRunnerStub = {
    run: ({ whenToExecute, task = () => { }, context }) => __awaiter(this, void 0, void 0, function* () {
        yield task.call(context);
    })
};
let apiClientStub = {
    getTomorrowsFixtures: () => { return Promise.resolve([1]); },
    getYesterdaysFixtures: () => { return Promise.resolve([2]); },
    getTodaysFixtures: () => { return Promise.resolve([3]); }
};
let fixturesUpdaterStub = {
    updateFixtures: (fixtures) => { return Promise.resolve(fixtures); }
};
let finishedFixturesProcessorStub = {
    processFixtures: (fixtures) => { return Promise.resolve(fixtures); }
};
let fixturesScheduler;
describe.only('ApiFootballData: Fixtures scheduler', () => {
    beforeEach(() => {
        fixturesScheduler = new fixtures_scheduler_1.FixturesScheduler(taskRunnerStub, apiClientStub, fixturesUpdaterStub, finishedFixturesProcessorStub);
    });
    xit('should set polling true/false when started/stopped respectively', (done) => {
        fixturesScheduler.start();
        expect(fixturesScheduler.IsPolling).to.be.true;
        fixturesScheduler.stop();
        fixturesScheduler.on('stopped', () => {
            expect(fixturesScheduler.IsPolling).to.be.false;
            done();
        });
    });
    xit('should run again after polling interval', (done) => {
        let clock = sinon.useFakeTimers();
        let spy = sinon.spy(fixturesScheduler, 'onTaskExecuted');
        let count = 0;
        fixturesScheduler.start();
        fixturesScheduler.on('task:executed', () => {
            count += 1;
            if (count == 2) {
                fixturesScheduler.stop();
            }
        });
        fixturesScheduler.on('stopped', () => {
            expect(spy).to.have.callCount(2);
            done();
        });
        clock.restore();
    });
    it('should call processFixtures', (done) => {
        let clock = sinon.useFakeTimers();
        let spy = sinon.spy(fixturesScheduler, 'processFixtures');
        fixturesScheduler.start();
        fixturesScheduler.on('task:executed', () => {
            fixturesScheduler.stop();
        });
        fixturesScheduler.on('stopped', () => {
            expect(spy).to.have.been.called;
            done();
        });
        clock.restore();
    });
});
//# sourceMappingURL=fixtures.scheduler.spec.js.map