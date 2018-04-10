"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PredictionCalculator {
    static getInstance() {
        return new PredictionCalculator();
    }
    calculateScore(result, choice) {
        let scorePoints = {
            points: 0,
            APoints: 0,
            BPoints: 0,
            MatchOutcomePoints: 0,
            TeamScorePlusPoints: 0,
            GoalDifferencePoints: 0,
            ExactScorePoints: 0,
            TeamScoreMinusPoints: 0
        };
        let choiceOutcome = calcOutcome(choice.goalsHomeTeam, choice.goalsAwayTeam);
        let resultOutcome = calcOutcome(result.goalsHomeTeam, result.goalsAwayTeam);
        if (choiceOutcome === resultOutcome) {
            scorePoints.MatchOutcomePoints = 4;
            scorePoints.APoints += 4;
        }
        if (choice.goalsHomeTeam === result.goalsHomeTeam) {
            scorePoints.TeamScorePlusPoints += result.goalsHomeTeam || 1;
            scorePoints.APoints += result.goalsHomeTeam || 1;
        }
        if (choice.goalsAwayTeam === result.goalsAwayTeam) {
            scorePoints.TeamScorePlusPoints += result.goalsAwayTeam || 1;
            scorePoints.APoints += result.goalsAwayTeam || 1;
        }
        let choiceGd = choice.goalsHomeTeam - choice.goalsAwayTeam;
        let resultGd = result.goalsHomeTeam - result.goalsAwayTeam;
        if (choiceGd === resultGd) {
            scorePoints.GoalDifferencePoints = 1;
            scorePoints.BPoints += 1;
        }
        if (choice.goalsHomeTeam === result.goalsHomeTeam &&
            choice.goalsAwayTeam === result.goalsAwayTeam) {
            scorePoints.ExactScorePoints = 1;
            scorePoints.BPoints += 1;
        }
        let homeGoalsGd = Math.abs(choice.goalsHomeTeam - result.goalsHomeTeam);
        if (homeGoalsGd > 1) {
            scorePoints.TeamScoreMinusPoints -= 1;
            scorePoints.BPoints -= 1;
        }
        let awayGoalsGd = Math.abs(choice.goalsAwayTeam - result.goalsAwayTeam);
        if (awayGoalsGd > 1) {
            scorePoints.TeamScoreMinusPoints -= 1;
            scorePoints.BPoints -= 1;
        }
        scorePoints.points = scorePoints.APoints + scorePoints.BPoints;
        return scorePoints;
    }
}
exports.PredictionCalculator = PredictionCalculator;
exports.default = PredictionCalculator;
function calcOutcome(home, away) {
    if (home > away) {
        return 'w';
    }
    if (home < away) {
        return 'l';
    }
    if (home === away) {
        return 'd';
    }
}
//# sourceMappingURL=prediction.calculator.js.map