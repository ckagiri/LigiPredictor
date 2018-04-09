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
    findOneAndUpsert$(leaderboardId, userId, fixtureId, predictionId, points, hasJoker) {
        return rxjs_1.Observable.of({});
    }
    findByLeaderboardOrderByPoints$(leaderboardId) {
        return rxjs_1.Observable.of([{}]);
    }
}
exports.UserScoreRepository = UserScoreRepository;
//# sourceMappingURL=userScore.repo.js.map