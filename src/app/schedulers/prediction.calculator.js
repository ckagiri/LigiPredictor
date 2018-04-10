"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PredictionCalculator {
    calculateScore(choice, result) {
        return {
            points: 0,
            APoints: 0,
            BPoints: 0,
            MatchOutcomePoints: 0,
            TeamScorePlusPoints: 0,
            GoalDifferencePoints: 0,
            ExactScorePoints: 0,
            TeamScoreMinusPoints: 0
        };
    }
}
exports.PredictionCalculator = PredictionCalculator;
//# sourceMappingURL=prediction.calculator.js.map