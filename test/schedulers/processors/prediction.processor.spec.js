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
        _id: ObjectId().toHexString(),
        season: '4edd40c86762e0fb12000001',
        gameRound: 2,
        homeTeam, awayTeam, status,
        externalReference: {
            [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: { id }
        }
    };
};
let chalo = {
    _id: ObjectId().toHexString(),
    userName: 'chalo'
};
let kagiri = {
    _id: ObjectId().toHexString(),
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
let chaloJoker = { user: chalo._id, fixture: liv_sou._id };
let kagiriJoker = { user: kagiri._id, fixture: ars_che._id };
let predictionRepoStub = {
    getOrCreateJoker$: sinon.stub(),
    findOneOrCreate$: () => { return rxjs_1.Observable.of(); }
};
let predictionProcessor;
describe.only('Prediction Processor', () => {
    beforeEach(() => {
        predictionProcessor = new prediction_processor_1.PredictionProcessor(fixtureRepoStub, userRepoStub, predictionRepoStub);
        predictionRepoStub.getOrCreateJoker$.withArgs(sinon.match(chalo._id)).returns(rxjs_1.Observable.of(chaloJoker));
        predictionRepoStub.getOrCreateJoker$.withArgs(sinon.match(kagiri._id)).returns(rxjs_1.Observable.of(kagiriJoker));
    });
    afterEach(() => {
        predictionRepoStub.getOrCreateJoker$ = sinon.stub();
    });
    describe('getPredictions', () => __awaiter(this, void 0, void 0, function* () {
        it('should get the selectable fixtures of gameRound', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(fixtureRepoStub, 'findSelectableFixtures$');
            yield predictionProcessor.getPredictions(ars_che);
            expect(spy).to.have.been.calledOnce;
        }));
        it('should get all users', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(userRepoStub, 'findAll$');
            yield predictionProcessor.getPredictions(ars_che);
            expect(spy).to.have.been.calledOnce;
        }));
        it('should getOrCreate jokerPrediction for user', () => __awaiter(this, void 0, void 0, function* () {
            let spy = predictionRepoStub.getOrCreateJoker$;
            yield predictionProcessor.getPredictions(ars_che);
            expect(spy).to.have.been.calledTwice;
            expect(spy.firstCall).have.been.calledWithExactly(chalo._id, ars_che.season, ars_che.gameRound, [liv_sou._id, ars_che._id]);
            expect(spy.secondCall).calledWithExactly(kagiri._id, ars_che.season, ars_che.gameRound, [liv_sou._id, ars_che._id]);
        }));
        describe('getOrCreate Prediction', () => {
            afterEach(() => {
                predictionRepoStub.findOneOrCreate$.restore();
            });
            it('should getOrCreate prediction if joker fixure != fixture passed', () => __awaiter(this, void 0, void 0, function* () {
                let spy = sinon.spy(predictionRepoStub, 'findOneOrCreate$');
                yield predictionProcessor.getPredictions(ars_che);
                expect(spy).to.have.been.calledOnce;
                expect(spy).to.have.been.calledWithExactly(chalo._id, ars_che._id);
            }));
            it('should not getOrCreate prediction if joker fixture == passedIn fixture', () => __awaiter(this, void 0, void 0, function* () {
                let spy = sinon.spy(predictionRepoStub, 'findOneOrCreate$');
                yield predictionProcessor.getPredictions(liv_sou);
                expect(spy).to.have.been.calledOnce;
            }));
        });
    }));
    xdescribe('processPrediction', () => {
        it('should calculate score for prediction', () => {
        });
        it('should save calculatedScore for prediction', () => {
        });
    });
});
//# sourceMappingURL=prediction.processor.spec.js.map