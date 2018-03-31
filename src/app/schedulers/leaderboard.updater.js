"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const fixture_model_1 = require("../../db/models/fixture.model");
const user_repo_1 = require("../../db/repositories/user.repo");
const leaderboard_model_1 = require("../../db/models/leaderboard.model");
const leaderboard_repo_1 = require("../../db/repositories/leaderboard.repo");
const prediction_repo_1 = require("../../db/repositories/prediction.repo");
const userScore_repo_1 = require("../../db/repositories/userScore.repo");
class LeaderboardUpdater {
    constructor(userRepo, leaderboardRepo, predictionRepo, userScoreRepo) {
        this.userRepo = userRepo;
        this.leaderboardRepo = leaderboardRepo;
        this.predictionRepo = predictionRepo;
        this.userScoreRepo = userScoreRepo;
    }
    static getInstance() {
        user_repo_1.UserRepository.getInstance(),
            leaderboard_repo_1.LeaderboardRepository.getInstance(),
            prediction_repo_1.PredictionRepository.getInstance(),
            userScore_repo_1.UserScoreRepository.getInstance();
    }
    updateScores(fixtures) {
        return rxjs_1.Observable.from(fixtures)
            .filter(fixture => {
            return fixture.status === fixture_model_1.FixtureStatus.FINISHED && fixture.allPredictionsProcessed === false;
        })
            .flatMap(fixture => {
            return this.userRepo.findAll$()
                .flatMap(users => {
                return rxjs_1.Observable.from(users);
            })
                .map(user => {
                return { user, fixture };
            });
        })
            .flatMap(data => {
            let { user, fixture } = data;
            let { season, gameRound, date } = fixture;
            let month = date.getUTCMonth() + 1;
            let year = date.getFullYear();
            let boards = [];
            let sBoard = this.leaderboardRepo.findSeasonBoardAndUpdate$(season, { status: leaderboard_model_1.LeaderboardStatus.UPDATING_SCORES });
            let mBoard = this.leaderboardRepo.findMonthBoardAndUpdate$(season, year, month, { status: leaderboard_model_1.LeaderboardStatus.UPDATING_SCORES });
            let rBoard = this.leaderboardRepo.findRoundBoardAndUpdate$(season, gameRound, { status: leaderboard_model_1.LeaderboardStatus.UPDATING_SCORES });
            boards.push(sBoard, mBoard, rBoard);
            return rxjs_1.Observable.forkJoin(boards)
                .flatMap(leaderboards => {
                return rxjs_1.Observable.from(leaderboards);
            })
                .map(leaderboard => {
                return { user, fixture, leaderboard };
            });
        })
            .flatMap(data => {
            let { user, fixture, leaderboard } = data;
            return this.predictionRepo.findOne$(user['_id'], fixture['_id'])
                .map(prediction => {
                return { user, fixture, leaderboard, prediction };
            });
        })
            .concatMap(data => {
            let { user, fixture, leaderboard, prediction } = data;
            let userId = user['_id'];
            let fixtureId = fixture['_id'];
            let leaderboardId = leaderboard['_id'];
            let predictionId = prediction['_id'];
            let { points, hasJoker } = prediction;
            return this.userScoreRepo.findOneAndUpdateOrCreate$(leaderboardId, userId, fixtureId, predictionId, points, hasJoker);
        })
            .count()
            .toPromise();
    }
    updateRankings(seasonId) {
        return this.leaderboardRepo.findAll$({ season: seasonId, status: leaderboard_model_1.LeaderboardStatus.UPDATING_SCORES })
            .flatMap(leaderboards => {
            return rxjs_1.Observable.from(leaderboards);
        })
            .flatMap(leaderboard => {
            return this.leaderboardRepo.findByIdAndUpdate$(leaderboard['_id'], { status: leaderboard_model_1.LeaderboardStatus.UPDATING_RANKINGS });
        })
            .flatMap(leaderboard => {
            return this.userScoreRepo.findByLeaderboardOrderByPoints$(leaderboard['_id']);
        })
            .flatMap(userScores => {
            return rxjs_1.Observable.from(userScores);
        })
            .concatMap((standing, index) => {
            index += 1;
            let prevPosition = standing.positionNew || 0;
            let positionOld = prevPosition;
            let positionNew = index;
            return this.userScoreRepo.findByIdAndUpdate$(standing['_id'], { positionNew, positionOld });
        })
            .count()
            .toPromise();
    }
}
exports.LeaderboardUpdater = LeaderboardUpdater;
//# sourceMappingURL=leaderboard.updater.js.map