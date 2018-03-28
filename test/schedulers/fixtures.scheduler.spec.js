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
const fixtures_scheduler_1 = require("../../src/app/schedulers/footballApi/fixtures.scheduler");
let taskRunnerStub = {
    run: ({ whenToExecute, task = () => { }, context }) => __awaiter(this, void 0, void 0, function* () {
        yield task.call(context);
    })
};
let newFixture = (homeTeam, awayTeam, status = 'FINISHED') => { return { homeTeam, awayTeam, status }; };
let ars_che_td = newFixture('Arsenal', 'Chelsea');
let liv_sou_td = newFixture('Liverpool', 'Southampton');
let eve_bur_yd = newFixture('Everton', 'Burnley');
let bou_wat_tm = newFixture('Bournemouth', 'Watford');
let apiClientStub = {
    getTomorrowsFixtures: () => { return Promise.resolve({ data: { fixtures: [bou_wat_tm] } }); },
    getYesterdaysFixtures: () => { return Promise.resolve({ data: { fixtures: [eve_bur_yd] } }); },
    getTodaysFixtures: () => { return Promise.resolve({ data: { fixtures: [ars_che_td, liv_sou_td] } }); },
};
let fixtureConverterStub = {
    map: (data) => { return data; }
};
let fixturesUpdaterStub = {
    updateGameDetails: (fixtures) => { return Promise.resolve(fixtures); }
};
let eventMediatorStub = {
    publish(event, ...args) { }
};
let fixturesScheduler;
describe('ApiFootballData: Fixtures scheduler', () => {
    beforeEach(() => {
        fixturesScheduler = new fixtures_scheduler_1.FixturesScheduler(taskRunnerStub, apiClientStub, fixtureConverterStub, fixturesUpdaterStub, eventMediatorStub);
    });
    it('should set polling true/false when started/stopped respectively', (done) => {
        fixturesScheduler.start();
        expect(fixturesScheduler.IsPolling).to.be.true;
        fixturesScheduler.stop();
        fixturesScheduler.on('stopped', () => {
            expect(fixturesScheduler.IsPolling).to.be.false;
            done();
        });
    });
    it('should run again after polling interval', (done) => {
        let clock = sinon.useFakeTimers();
        let taskExecutionCount = 0;
        fixturesScheduler.start();
        fixturesScheduler.on('task:executed', () => {
            taskExecutionCount += 1;
            if (taskExecutionCount == 2) {
                fixturesScheduler.stop();
            }
        });
        fixturesScheduler.on('stopped', () => {
            expect(taskExecutionCount).to.equal(2);
            done();
        });
        clock.restore();
    });
    it('should call publish process:predictions', (done) => {
        let clock = sinon.useFakeTimers();
        let spy = sinon.spy(eventMediatorStub, 'publish');
        fixturesScheduler.start();
        fixturesScheduler.on('task:executed', () => {
            fixturesScheduler.stop();
        });
        fixturesScheduler.on('stopped', () => {
            expect(spy).to.have.been.called;
            done();
        });
        //todo: tohave been called with first arg, second arg
        clock.restore();
    });
});
//# sourceMappingURL=fixtures.scheduler.spec.js.map