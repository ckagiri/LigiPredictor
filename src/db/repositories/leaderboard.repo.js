"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        let query = { season: seasonId, boardType: leaderboard_model_1.BoardType.GLOBAL_SEASON };
        return this.findOneAndUpdate$(query, update, { upsert: true, new: true });
    }
    findMonthBoardAndUpsert$(seasonId, year, month, update) {
        let query = { season: seasonId, year, month, boardType: leaderboard_model_1.BoardType.GLOBAL_MONTH };
        return this.findOneAndUpdate$(query, update, { upsert: true, new: true });
    }
    findRoundBoardAndUpsert$(seasonId, gameRound, update) {
        let query = { season: seasonId, gameRound, boardType: leaderboard_model_1.BoardType.GLOBAL_ROUND };
        return this.findOneAndUpdate$(query, update, { upsert: true, new: true });
    }
}
exports.LeaderboardRepository = LeaderboardRepository;
//# sourceMappingURL=leaderboard.repo.js.map