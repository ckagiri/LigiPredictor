"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var PredictionStatus;
(function (PredictionStatus) {
    PredictionStatus["PENDING"] = "PENDING";
    PredictionStatus["PROCESSED"] = "PROCESSED";
})(PredictionStatus = exports.PredictionStatus || (exports.PredictionStatus = {}));
const predictionSchema = new mongoose_1.Schema({});
exports.PredictionModel = mongoose_1.model('Prediction', predictionSchema);
//# sourceMappingURL=prediction.model.js.map