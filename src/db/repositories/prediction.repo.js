"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const prediction_model_1 = require("../models/prediction.model");
const base_repo_1 = require("./base.repo");
class PredictionRepository {
    static getInstance() {
        return new PredictionRepository();
    }
    constructor() {
        this._baseRepo = new base_repo_1.BaseRepository(prediction_model_1.PredictionModel);
    }
    getOrCreateJoker$() {
        return rxjs_1.Observable.of({});
    }
}
exports.PredictionRepository = PredictionRepository;
//# sourceMappingURL=prediction.repo.js.map