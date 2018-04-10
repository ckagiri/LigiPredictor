"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var PredictionStatus;
(function (PredictionStatus) {
    PredictionStatus["PENDING"] = "PENDING";
    PredictionStatus["PROCESSED"] = "PROCESSED";
})(PredictionStatus = exports.PredictionStatus || (exports.PredictionStatus = {}));
const { String, Number, Boolean, ObjectId, Mixed } = mongoose_1.Schema.Types;
const Status = PredictionStatus;
const predictionSchema = new mongoose_1.Schema({
    user: { type: ObjectId, ref: 'User', required: true, index: true },
    fixture: { type: ObjectId, ref: 'Fixture', required: true, index: true },
    fixtureSlug: { type: String, trim: true },
    season: { type: ObjectId, ref: 'Season' },
    gameRound: { type: Number },
    choice: {
        goalsHomeTeam: { type: Number },
        goalsAwayTeam: { type: Number },
        isComputerGenerated: { type: Boolean, default: true }
    },
    timestamp: { type: mongoose_1.Schema.Types.Date, default: Date.now() },
    scorePoints: {
        points: { type: Number },
        pointsFor: { type: Number },
        pointsAgainst: { type: Number },
        MatchOutcomePoints: { type: Number },
        GoalDifferencePoints: { type: Number },
        ExactScorePoints: { type: Number },
        ScoreDifferencePoints: { type: Number },
        TeamScorePoints: { type: Number }
    },
    hasJoker: { type: Boolean, default: false },
    jokerAutoPicked: { type: Boolean, default: false },
    status: {
        type: String,
        enum: [Status.PENDING, Status.PROCESSED],
        default: Status.PENDING
    }
});
exports.PredictionModel = mongoose_1.model('Prediction', predictionSchema);
//# sourceMappingURL=prediction.model.js.map