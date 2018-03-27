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
const finishedFixtures_scheduler_1 = require("../../src/app/schedulers/finishedFixtures.scheduler");
const fixtures_scheduler_1 = require("../../src/app/schedulers/footballApi/fixtures.scheduler");
const eventMediator_1 = require("../../src/common/eventMediator");
let taskRunnerStub = {
    run: ({ whenToExecute, task = () => { }, context }) => __awaiter(this, void 0, void 0, function* () {
        yield task.call(context);
    })
};
let fixturesProcessorStub = {
    processPredictions: (fixtures) => { }
};
let finishedFixturesScheduler;
describe('ApiFootballData: FinishedFixtures scheduler', () => {
    beforeEach(() => {
        let eventMediator = eventMediator_1.EventMediator.getInstance();
        eventMediator.removeAllListeners();
        finishedFixturesScheduler = new finishedFixtures_scheduler_1.FinishedFixturesScheduler(taskRunnerStub, fixturesProcessorStub, eventMediator_1.EventMediator.getInstance());
    });
    it('should set polling true/false when started/stopped respectively', (done) => {
        finishedFixturesScheduler.start();
        expect(finishedFixturesScheduler.IsRunning).to.be.true;
        finishedFixturesScheduler.stop();
        finishedFixturesScheduler.on('stopped', () => {
            expect(finishedFixturesScheduler.IsRunning).to.be.false;
            done();
        });
    });
    describe('finished fixtures updated', () => {
        let newFixture = (homeTeam, awayTeam, status = 'FINISHED') => { return { homeTeam, awayTeam, status }; };
        let ars_che_td = newFixture('Arsenal', 'Chelsea');
        let liv_sou_td = newFixture('Liverpool', 'Southampton');
        let apiClientStub = {
            getTomorrowsFixtures: () => { return Promise.resolve({ data: { fixtures: [] } }); },
            getYesterdaysFixtures: () => { return Promise.resolve({ data: { fixtures: [] } }); },
            getTodaysFixtures: () => { return Promise.resolve({ data: { fixtures: [ars_che_td, liv_sou_td] } }); },
        };
        let fixtureConverterStub = {
            map: (data) => { return data; }
        };
        let fixturesUpdaterStub = {
            updateGameDetails: (fixtures) => { return Promise.resolve(fixtures); }
        };
        let fixturesScheduler;
        beforeEach(() => {
            fixturesScheduler = new fixtures_scheduler_1.FixturesScheduler(taskRunnerStub, apiClientStub, fixtureConverterStub, fixturesUpdaterStub, eventMediator_1.EventMediator.getInstance());
        });
        it('should processPredictions', (done) => {
            let clock = sinon.useFakeTimers();
            let spy = sinon.spy(fixturesProcessorStub, 'processPredictions');
            fixturesScheduler.start();
            finishedFixturesScheduler.start();
            fixturesScheduler.on('task:executed', () => {
                fixturesScheduler.stop();
            });
            finishedFixturesScheduler.on('task:executed', () => {
                finishedFixturesScheduler.stop();
            });
            eventMediator_1.EventMediator.getInstance().addListener('predictions:processed', () => {
                expect(spy).to.have.been.called;
                done();
            });
            clock.restore();
        });
    });
});
//# sourceMappingURL=finishedFixtures.scheduler.spec.js.map