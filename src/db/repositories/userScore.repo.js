"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const userScore_model_1 = require("../models/userScore.model");
const base_repo_1 = require("./base.repo");
class UserScoreRepository extends base_repo_1.BaseRepository {
    static getInstance() {
        return new UserScoreRepository();
    }
    constructor() {
        super(userScore_model_1.UserScoreModel);
    }
    findOneAndUpsert$(leaderboardId, userId, fixtureId, predictionId, predictionPoints, hasJoker) {
        let { points, APoints, BPoints, MatchOutcomePoints, TeamScorePlusPoints, ExactScorePoints, GoalDifferencePoints, TeamScoreMinusPoints } = predictionPoints;
        let score = {
            leaderboard: leaderboardId,
            user: userId,
            points,
            APoints,
            BPoints,
            MatchOutcomePoints,
            TeamScorePlusPoints,
            ExactScorePoints,
            GoalDifferencePoints,
            TeamScoreMinusPoints
        };
        return this.findOne$({ leaderboard: leaderboardId, user: userId })
            .flatMap(standing => {
            if (standing == null) {
                score.fixtures = [fixtureId];
                score.predictions = [predictionId];
                score.pointsExcludingJoker = points;
                score.APointsExcludingJoker = APoints;
                score.BPointsExcludingJoker = BPoints;
                if (hasJoker && points > 0) {
                    score.points *= 2;
                    score.APoints *= 2;
                    score.BPoints *= 2;
                    score.MatchOutcomePoints *= 2;
                    score.TeamScorePlusPoints *= 2;
                    score.ExactScorePoints *= 2;
                    score.GoalDifferencePoints *= 2;
                    score.TeamScoreMinusPoints *= 2;
                }
                return this.insert$(score);
            }
            else {
                let fixtures = standing.fixtures;
                let fixtureExists = fixtures.some(n => n.toString() === fixtureId);
                if (fixtureExists) {
                    return rxjs_1.Observable.of(standing);
                }
                standing.pointsExcludingJoker += points;
                standing.APointsExcludingJoker += APoints;
                standing.BPointsExcludingJoker += BPoints;
                let shouldDouble = hasJoker && points > 0;
                standing.MatchOutcomePoints += shouldDouble ? MatchOutcomePoints * 2 : MatchOutcomePoints;
                standing.TeamScorePlusPoints += shouldDouble ? TeamScoreMinusPoints * 2 : TeamScorePlusPoints;
                standing.ExactScorePoints += shouldDouble ? ExactScorePoints * 2 : ExactScorePoints;
                standing.GoalDifferencePoints += shouldDouble ? GoalDifferencePoints * 2 : GoalDifferencePoints;
                standing.TeamScoreMinusPoints += shouldDouble ? TeamScoreMinusPoints * 2 : TeamScoreMinusPoints;
                standing.APoints += shouldDouble ? APoints * 2 : APoints;
                standing.BPoints += shouldDouble ? BPoints * 2 : BPoints;
                standing.points += shouldDouble ? points * 2 : points;
                return this.findByIdAndUpdate$(standing.id, {
                    $set: {
                        points: standing.points,
                        APoints: standing.APoints,
                        BPoints: standing.BPoints,
                        MatchOutcomePoints: standing.MatchOutcomePoints,
                        TeamScorePlusPoints: standing.TeamScorePlusPoints,
                        ExactScorePoints: standing.ExactScorePoints,
                        GoalDifferencePoints: standing.GoalDifferencePoints,
                        TeamScoreMinusPoints: standing.TeamScoreMinusPoints,
                        pointsExcludingJoker: standing.pointsExcludingJoker,
                        APointsExcludingJoker: standing.APointsExcludingJoker,
                        BPointsExcludingJoker: standing.BPointsExcludingJoker
                    },
                    $push: { fixtures: fixtureId, predictions: predictionId }
                });
            }
        });
    }
    findByLeaderboardOrderByPoints$(leaderboardId) {
        return this.findAll$({ leaderboard: leaderboardId }, null, {
            sort: {
                points: -1, APoints: -1, BPoints: -1,
                MatchOutcomePoints: -1, TeamScorePlusPoints: -1,
                ExactScorePoints: -1, GoalDifferencePoints: -1
            }
        });
    }
}
exports.UserScoreRepository = UserScoreRepository;
//# sourceMappingURL=userScore.repo.js.map