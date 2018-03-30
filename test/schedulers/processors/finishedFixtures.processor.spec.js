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
const prediction_model_1 = require("../../../src/db/models/prediction.model");
const finishedFixtures_processor_1 = require("../../../src/app/schedulers/finishedFixtures.processor");
let newFixture = (id, homeTeam, awayTeam, status = fixture_model_1.FixtureStatus.FINISHED) => {
    return {
        _id: ObjectId().toHexString(),
        season: '4edd40c86762e0fb12000001',
        gameRound: 2,
        homeTeam, awayTeam, status,
        result: { goalsHomeTeam: 2, goalsAwayTeam: 1 },
        allPredictionsProcessed: false,
        externalReference: {
            [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: { id }
        }
    };
};
let ars_che = newFixture(1, 'Arsenal', 'Chelsea');
let liv_sou = newFixture(2, 'Liverpool', 'Southampton');
let eve_wat = newFixture(3, 'Everton', 'Watford', fixture_model_1.FixtureStatus.IN_PLAY);
let bou_wat = newFixture(4, 'Bournemouth', 'Watford');
bou_wat.allPredictionsProcessed = true;
let finishedFixtures = [ars_che, liv_sou, eve_wat, bou_wat];
let chalo = ObjectId().toHexString();
let kag = ObjectId().toHexString();
let newPrediction = (userId, fixture, status = prediction_model_1.PredictionStatus.PENDING) => {
    return {
        user: userId, fixture, status, choice: { goalsHomeTeam: 1, goalsAwayTeam: 1 }
    };
};
let pred1 = newPrediction(chalo, ars_che);
let pred2 = newPrediction(kag, ars_che, prediction_model_1.PredictionStatus.PROCESSED);
let pred3 = newPrediction(chalo, liv_sou);
let pred4 = newPrediction(kag, liv_sou);
let predictionProcessorStub = {
    getPredictions$: sinon.stub(),
    processPrediction$: sinon.stub()
};
let finishedFixturesProcessor;
describe.only('Finished Fixtures', () => {
    describe('processPredictions', () => {
        beforeEach(() => {
            predictionProcessorStub.getPredictions$.withArgs(sinon.match(ars_che)).returns(rxjs_1.Observable.of([pred1, pred2]));
            predictionProcessorStub.getPredictions$.withArgs(sinon.match(liv_sou)).returns(rxjs_1.Observable.of([pred3, pred4]));
            predictionProcessorStub.processPrediction$.returns(rxjs_1.Observable.of(pred1));
            finishedFixturesProcessor = new finishedFixtures_processor_1.FinishedFixturesProcessor(predictionProcessorStub);
        });
        afterEach(() => {
            predictionProcessorStub.getPredictions$ = sinon.stub();
            predictionProcessorStub.processPrediction$ = sinon.stub();
        });
        it('should getPredictions for FINISHED fixture but not AllPredictionsProcessed', () => __awaiter(this, void 0, void 0, function* () {
            let spy = predictionProcessorStub.getPredictions$;
            yield finishedFixturesProcessor.processPredictions(finishedFixtures);
            expect(spy).to.have.been.calledTwice;
        }));
        it('should process PENDING predictions', () => __awaiter(this, void 0, void 0, function* () {
            let spy = predictionProcessorStub.processPrediction$;
            let predictions = yield finishedFixturesProcessor.processPredictions(finishedFixtures);
            expect(spy).to.have.callCount(3);
        }));
    });
    describe('setToTrueAllPredictionsProcessed', () => {
    });
});
//# sourceMappingURL=finishedFixtures.processor.spec.js.map