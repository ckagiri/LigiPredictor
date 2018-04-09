"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const leaderboard_model_1 = require("../models/leaderboard.model");
const base_repo_1 = require("./base.repo");
class LeaderboardRepository extends base_repo_1.BaseRepository {
    static getInstance() {
        return new LeaderboardRepository();
    }
    constructor() {
        super(leaderboard_model_1.LeaderboardModel);
    }
    findSeasonBoardAndUpsert$(seasonId, update) {
        return rxjs_1.Observable.of({});
    }
    findMonthBoardAndUpsert$(seasonId, year, month, update) {
        return rxjs_1.Observable.of({});
    }
    findRoundBoardAndUpsert$(seasonId, gameRound, update) {
        return rxjs_1.Observable.of({});
    }
}
exports.LeaderboardRepository = LeaderboardRepository;
//# sourceMappingURL=leaderboard.repo.js.map