"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const prediction_model_1 = require("../models/prediction.model");
const base_repo_1 = require("./base.repo");
class PredictionRepository extends base_repo_1.BaseRepository {
    static getInstance() {
        return new PredictionRepository();
    }
    constructor() {
        super(prediction_model_1.PredictionModel);
    }
    getOrCreateJoker$(userId, seasonId, gameRound, pick) {
        return rxjs_1.Observable.of({});
    }
    findByUserAndFixtureOrCreate$(userId, fixtureId) {
        return rxjs_1.Observable.of({});
    }
    findByUserAndFixture$(userId, fixtureId) {
        return rxjs_1.Observable.of({});
    }
}
exports.PredictionRepository = PredictionRepository;
//# sourceMappingURL=prediction.repo.js.map