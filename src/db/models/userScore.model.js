"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { Number, ObjectId } = mongoose_1.Schema.Types;
const userScoreSchema = new mongoose_1.Schema({
    user: { type: ObjectId, ref: 'User', required: true, index: true },
    leaderboard: { type: ObjectId, ref: 'Leaderboard', required: true, index: true },
    fixtures: [{ type: ObjectId, ref: "Fixture" }],
    predictions: [{ type: ObjectId, ref: "Prediction" }],
    points: { type: Number },
    APoints: { type: Number },
    BPoints: { type: Number },
    MatchOutcomePoints: { type: Number },
    TeamScorePlusPoints: { type: Number },
    GoalDifferencePoints: { type: Number },
    ExactScorePoints: { type: Number },
    TeamScoreMinusPoints: { type: Number },
    pointsExcludingJoker: { type: Number },
    pointsOld: { type: Number },
    pointsNew: { type: Number },
    positionOld: { type: Number },
    positionNew: { type: Number }
});
exports.UserScoreModel = mongoose_1.model('UserScore', userScoreSchema);
//# sourceMappingURL=userScore.model.js.map