"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const prediction_model_1 = require("../../db/models/prediction.model");
const fixture_model_1 = require("../../db/models/fixture.model");
const prediction_processor_1 = require("./prediction.processor");
const fixture_repo_1 = require("../../db/repositories/fixture.repo");
class FinishedFixturesProcessor {
    constructor(predictionProcessor, fixtureRepo) {
        this.predictionProcessor = predictionProcessor;
        this.fixtureRepo = fixtureRepo;
    }
    static getInstance() {
        return new FinishedFixturesProcessor(prediction_processor_1.PredictionProcessor.getInstance(), fixture_repo_1.FixtureRepository.getInstance());
    }
    processPredictions(fixtures) {
        return rxjs_1.Observable.from(fixtures)
            .filter(fixture => {
            return fixture.status === fixture_model_1.FixtureStatus.FINISHED && fixture.allPredictionsProcessed === false;
        })
            .concatMap(fixture => {
            return this.predictionProcessor.getPredictions$(fixture)
                .flatMap(predictions => {
                return rxjs_1.Observable.from(predictions);
            })
                .map(prediction => {
                return { fixture, prediction };
            });
        })
            .filter(data => {
            return data.prediction.status !== prediction_model_1.PredictionStatus.PROCESSED;
        })
            .flatMap(data => {
            let { fixture, prediction } = data;
            return this.predictionProcessor.processPrediction$(prediction, fixture);
        })
            .count()
            .toPromise();
    }
    setToTrueAllPredictionsProcessed(fixtures) {
        return rxjs_1.Observable.from(fixtures)
            .filter(fixture => {
            return fixture.status === fixture_model_1.FixtureStatus.FINISHED && fixture.allPredictionsProcessed === false;
        })
            .flatMap(fixture => {
            return this.fixtureRepo.findByIdAndUpdate$(fixture.id, { allPredictionsProcessed: true });
        })
            .count()
            .toPromise();
    }
}
exports.FinishedFixturesProcessor = FinishedFixturesProcessor;
//# sourceMappingURL=finishedFixtures.processor.js.map