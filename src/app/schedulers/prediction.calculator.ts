import  {ScorePoints } from '../../db/models/userScore.model';

interface MatchScore { goalsHomeTeam: number, goalsAwayTeam: number }

export interface IPredictionCalculator {
  calculateScore(choice: MatchScore, result: MatchScore): ScorePoints;
}

export class PredictionCalculator implements IPredictionCalculator {
  calculateScore(choice: MatchScore, result: MatchScore) {
    return {
      points: 0, pointsFor: 0, pointsAgainst: 0, MatchOutcomePoints: 0, GoalDifferencePoints: 0, TeamScorePoints: 0
    }
  }
}