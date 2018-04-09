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
    setCacheService(cacheService) {
        this.cacheService = cacheService;
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
            let sBoard;
            let mBoard;
            let rBoard;
            if (this.cacheService != null) {
                sBoard = this.cacheService.get(`${season}`, this.leaderboardRepo.findSeasonBoardAndUpsert$(season, { status: leaderboard_model_1.LeaderboardStatus.UPDATING_SCORES }));
                mBoard = this.cacheService.get(`${season}-${year}-${month}`, this.leaderboardRepo.findMonthBoardAndUpsert$(season, year, month, { status: leaderboard_model_1.LeaderboardStatus.UPDATING_SCORES }));
                rBoard = this.cacheService.get(`${season}-${gameRound}`, this.leaderboardRepo.findRoundBoardAndUpsert$(season, gameRound, { status: leaderboard_model_1.LeaderboardStatus.UPDATING_SCORES }));
            }
            else {
                sBoard = this.leaderboardRepo.findSeasonBoardAndUpsert$(season, { status: leaderboard_model_1.LeaderboardStatus.UPDATING_SCORES });
                mBoard = this.leaderboardRepo.findMonthBoardAndUpsert$(season, year, month, { status: leaderboard_model_1.LeaderboardStatus.UPDATING_SCORES });
                rBoard = this.leaderboardRepo.findRoundBoardAndUpsert$(season, gameRound, { status: leaderboard_model_1.LeaderboardStatus.UPDATING_SCORES });
            }
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
            return this.predictionRepo.findOne$({ userId: user.id, fixtureId: fixture.id })
                .map(prediction => {
                return { user, fixture, leaderboard, prediction };
            });
        })
            .concatMap(data => {
            let { user, fixture, leaderboard, prediction } = data;
            let userId = user.id;
            let fixtureId = fixture.id;
            let leaderboardId = leaderboard.id;
            let predictionId = prediction.id;
            let { points, hasJoker } = prediction;
            return this.userScoreRepo.findOneAndUpsert$(leaderboardId, userId, fixtureId, predictionId, points, hasJoker);
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
            return this.leaderboardRepo.findByIdAndUpdate$(leaderboard.id, { status: leaderboard_model_1.LeaderboardStatus.UPDATING_RANKINGS });
        })
            .flatMap(leaderboard => {
            return this.userScoreRepo.findByLeaderboardOrderByPoints$(leaderboard.id);
        })
            .flatMap(userScores => {
            return rxjs_1.Observable.from(userScores);
        })
            .concatMap((standing, index) => {
            index += 1;
            let prevPosition = standing.positionNew || 0;
            let positionOld = prevPosition;
            let positionNew = index;
            return this.userScoreRepo.findByIdAndUpdate$(standing.id, { positionNew, positionOld });
        })
            .count()
            .toPromise();
    }
    markLeaderboardsAsRefreshed(seasonId) {
        return this.leaderboardRepo.findAll$({ season: seasonId, status: leaderboard_model_1.LeaderboardStatus.UPDATING_RANKINGS })
            .flatMap(leaderboards => {
            return rxjs_1.Observable.from(leaderboards);
        })
            .flatMap(leaderboard => {
            return this.leaderboardRepo.findByIdAndUpdate$(leaderboard.id, { status: leaderboard_model_1.LeaderboardStatus.REFRESHED });
        })
            .count()
            .toPromise();
    }
}
exports.LeaderboardUpdater = LeaderboardUpdater;
//# sourceMappingURL=leaderboard.updater.js.map