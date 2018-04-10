import  { ScorePoints, Score } from '../../common/score';

export interface IPredictionCalculator {
  calculateScore(choice: Score, result: Score): ScorePoints;
}

export class PredictionCalculator implements IPredictionCalculator {
  calculateScore(choice: Score, result: Score) {
    return {
      points: 0,
      APoints: 0,
      BPoints: 0,
      MatchOutcomePoints: 0,  
      TeamScorePlusPoints: 0,
      GoalDifferencePoints: 0,
      ExactScorePoints: 0,
      TeamScoreMinusPoints: 0
    }
  }
}