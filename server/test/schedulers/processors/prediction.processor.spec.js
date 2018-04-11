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
const rxjs_1 = require("rxjs");
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Types.ObjectId;
const footballApiProvider_1 = require("../../../src/common/footballApiProvider");
const fixture_model_1 = require("../../../src/db/models/fixture.model");
const prediction_processor_1 = require("../../../src/app/schedulers/prediction.processor");
let newFixture = (id, homeTeam, awayTeam, status = fixture_model_1.FixtureStatus.FINISHED) => {
    return {
        id: ObjectId().toHexString(),
        season: '4edd40c86762e0fb12000001',
        gameRound: 2,
        homeTeam, awayTeam, status,
        result: { goalsHomeTeam: 2, goalsAwayTeam: 1 },
        externalReference: {
            [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: { id }
        }
    };
};
let chalo = {
    id: ObjectId().toHexString(),
    userName: 'chalo'
};
let kagiri = {
    id: ObjectId().toHexString(),
    userName: 'kagiri'
};
let ars_che = newFixture(1, 'Arsenal', 'Chelsea');
let liv_sou = newFixture(2, 'Liverpool', 'Southampton');
let fixtureRepoStub = {
    findSelectableFixtures$: () => { return rxjs_1.Observable.of([liv_sou]); }
};
let userRepoStub = {
    findAll$: () => { return rxjs_1.Observable.of([chalo, kagiri]); }
};
let chaloJoker = { id: ObjectId().toHexString(), user: chalo.id, fixture: liv_sou.id };
let kagiriJoker = { id: ObjectId().toHexString(), user: kagiri.id, fixture: ars_che.id };
let chaloPred = { id: ObjectId().toHexString(), user: chalo.id, fixture: ars_che.id,
    choice: { goalsHomeTeam: 1, goalsAwayTeam: 1 }
};
let predictionRepoStub = {
    findOrCreateJoker$: sinon.stub(),
    findOneOrCreate$: sinon.stub(),
    findByIdAndUpdate$: sinon.stub()
};
let predictionCalculatorStub = {
    calculateScore: () => { return { points: 9 }; }
};
let predictionProcessor;
describe('Prediction Processor', () => {
    describe('getPredictions$', () => __awaiter(this, void 0, void 0, function* () {
        beforeEach(() => {
            predictionRepoStub.findOrCreateJoker$.withArgs(sinon.match(chalo.id)).returns(rxjs_1.Observable.of(chaloJoker));
            predictionRepoStub.findOrCreateJoker$.withArgs(sinon.match(kagiri.id)).returns(rxjs_1.Observable.of(kagiriJoker));
            predictionRepoStub.findOneOrCreate$.returns(rxjs_1.Observable.of(chaloPred));
            predictionProcessor = new prediction_processor_1.PredictionProcessor(fixtureRepoStub, userRepoStub, predictionRepoStub, predictionCalculatorStub);
        });
        afterEach(() => {
            predictionRepoStub.findOrCreateJoker$ = sinon.stub();
            predictionRepoStub.findOneOrCreate$ = sinon.stub();
        });
        it('should get the selectable fixtures of gameRound', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(fixtureRepoStub, 'findSelectableFixtures$');
            yield predictionProcessor.getPredictions$(ars_che).toPromise();
            expect(spy).to.have.been.calledOnce;
        }));
        it('should get all users', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(userRepoStub, 'findAll$');
            yield predictionProcessor.getPredictions$(ars_che).toPromise();
            expect(spy).to.have.been.calledOnce;
        }));
        it('should findOrCreate jokerPrediction for user', () => __awaiter(this, void 0, void 0, function* () {
            let spy = predictionRepoStub.findOrCreateJoker$;
            yield predictionProcessor.getPredictions$(ars_che).toPromise();
            expect(spy).to.have.been.calledTwice;
            expect(spy.firstCall).to.have.been.calledWithExactly(chalo.id, ars_che.season, ars_che.gameRound, [liv_sou.id, ars_che.id]);
            expect(spy.secondCall).to.have.been.calledWithExactly(kagiri.id, ars_che.season, ars_che.gameRound, [liv_sou.id, ars_che.id]);
        }));
        it('should findOrCreate prediction if joker fixure != fixture passed', () => __awaiter(this, void 0, void 0, function* () {
            let spy = predictionRepoStub.findOneOrCreate$;
            yield predictionProcessor.getPredictions$(ars_che).toPromise();
            expect(spy).to.have.been.calledOnce;
            expect(spy).to.have.been.calledWith(sinon.match({ userId: chalo.id, fixtureId: ars_che.id }));
        }));
        it('should not findOrCreate prediction if joker fixture == passedIn fixture', () => __awaiter(this, void 0, void 0, function* () {
            let spy = predictionRepoStub.findOneOrCreate$;
            yield predictionProcessor.getPredictions$(liv_sou).toPromise();
            expect(spy).to.have.been.calledOnce;
        }));
        it('should return equal number of predictions to users', () => __awaiter(this, void 0, void 0, function* () {
            let predictions = yield predictionProcessor.getPredictions$(ars_che).toPromise();
            expect(predictions).to.be.an('array');
            expect(predictions.length).to.equal(2);
        }));
    }));
    describe('processPrediction', () => {
        beforeEach(() => {
            predictionRepoStub.findByIdAndUpdate$.returns(rxjs_1.Observable.of(chaloPred));
            predictionProcessor = new prediction_processor_1.PredictionProcessor(fixtureRepoStub, userRepoStub, predictionRepoStub, predictionCalculatorStub);
        });
        afterEach(() => {
            predictionRepoStub.findByIdAndUpdate$ = sinon.stub();
        });
        it('should calculate score for prediction', (done) => {
            let spy = sinon.spy(predictionCalculatorStub, 'calculateScore');
            predictionProcessor.processPrediction$(chaloPred, ars_che)
                .subscribe(_ => {
                expect(spy).to.have.been.calledOnce;
                expect(spy).to.have.been.calledWith({ goalsHomeTeam: 1, goalsAwayTeam: 1 }, { goalsHomeTeam: 2, goalsAwayTeam: 1 });
                done();
            });
        });
        it('should save calculatedScore for prediction', (done) => {
            let spy = predictionRepoStub.findByIdAndUpdate$;
            predictionProcessor.processPrediction$(chaloPred, ars_che)
                .subscribe(_ => {
                expect(spy).to.have.been.called;
                expect(spy).to.have.been.calledWithMatch(chaloPred.id);
                done();
            });
        });
    });
});
//# sourceMappingURL=prediction.processor.spec.js.map