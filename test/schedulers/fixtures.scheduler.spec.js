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
const fixture_model_1 = require("../../src/db/models/fixture.model");
let taskRunnerStub = {
    run: ({ whenToExecute, task = () => { }, context }) => __awaiter(this, void 0, void 0, function* () {
        yield task.call(context);
    })
};
let newFixture = (homeTeam, awayTeam, status = fixture_model_1.FixtureStatus.FINISHED) => { return { homeTeam, awayTeam, status }; };
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
    describe.only('nextUpdate', () => {
        it('should update after 90secs if any fixture is IN_PLAY', (done) => {
            ars_che_td.status = fixture_model_1.FixtureStatus.IN_PLAY;
            fixturesScheduler.start();
            fixturesScheduler.on('task:executed', () => {
                fixturesScheduler.stop();
            });
            fixturesScheduler.on('stopped', () => {
                expect(fixturesScheduler.NextUpdate).to.be.at.most(90 * 1000)
                    .and.to.be.at.least(89 * 1000);
                done();
            });
        });
        it('should update after 90secs if any fixture is within 5 mins to kickOff', (done) => {
            ars_che_td.status = fixture_model_1.FixtureStatus.TIMED;
            let date = new Date();
            date.setSeconds(+date.getSeconds() + 270);
            ars_che_td['date'] = date;
            fixturesScheduler.start();
            fixturesScheduler.on('task:executed', () => {
                fixturesScheduler.stop();
            });
            fixturesScheduler.on('stopped', () => {
                expect(fixturesScheduler.NextUpdate).to.be.at.most(90 * 1000)
                    .and.to.be.at.least(89 * 1000);
                done();
            });
        });
        it('should update after 6 hours if earliest kickOff is in 6 hours', (done) => {
            ars_che_td.status = fixture_model_1.FixtureStatus.TIMED;
            let date = new Date();
            date.setHours(+date.getHours() + 6);
            ars_che_td['date'] = date;
            fixturesScheduler.start();
            fixturesScheduler.on('task:executed', () => {
                fixturesScheduler.stop();
            });
            fixturesScheduler.on('stopped', () => {
                expect(fixturesScheduler.NextUpdate).to.be.at.most(6 * 60 * 60 * 1000)
                    .and.to.be.at.least((6 * 60 * 60 * 1000) - 10);
                done();
            });
        });
        it('should update after 12 hours if any kickOff is in after 12 hours', (done) => {
            ars_che_td.status = fixture_model_1.FixtureStatus.TIMED;
            let date = new Date();
            date.setHours(+date.getHours() + 15);
            ars_che_td['date'] = date;
            fixturesScheduler.start();
            fixturesScheduler.on('task:executed', () => {
                fixturesScheduler.stop();
            });
            fixturesScheduler.on('stopped', () => {
                expect(fixturesScheduler.NextUpdate).to.be.at.most(12 * 60 * 60 * 1000)
                    .and.to.be.at.least((12 * 60 * 60 * 1000) - 10);
                done();
            });
        });
    });
});
//# sourceMappingURL=fixtures.scheduler.spec.js.map