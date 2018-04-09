"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PredictionCalculator {
    calculateScore(choice, result) {
        return {
            points: 0, pointsFor: 0, pointsAgainst: 0,
            MatchOutcomePoints: 0, ScoreDifferencePoints: 0, TeamScorePoints: 0,
            ExactScorePoints: 0, GoalDifferencePoints: 0
        };
    }
}
exports.PredictionCalculator = PredictionCalculator;
//# sourceMappingURL=prediction.calculator.js.map