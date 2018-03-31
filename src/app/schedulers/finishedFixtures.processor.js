"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const prediction_model_1 = require("../../db/models/prediction.model");
const fixture_model_1 = require("../../db/models/fixture.model");
const prediction_processor_1 = require("./prediction.processor");
class FinishedFixturesProcessor {
    constructor(predictionProcessor) {
        this.predictionProcessor = predictionProcessor;
    }
    static getInstance() {
        return new FinishedFixturesProcessor(prediction_processor_1.PredictionProcessor.getInstance());
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
}
exports.FinishedFixturesProcessor = FinishedFixturesProcessor;
//# sourceMappingURL=finishedFixtures.processor.js.map