"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var BoardStatus;
(function (BoardStatus) {
    BoardStatus["UPDATING_SCORES"] = "UPDATING_SCORES";
    BoardStatus["UPDATING_RANKINGS"] = "UPDATING_RANKINGS";
    BoardStatus["REFRESHED"] = "REFRESHED";
})(BoardStatus = exports.BoardStatus || (exports.BoardStatus = {}));
var BoardType;
(function (BoardType) {
    BoardType["GLOBAL_SEASON"] = "GLOBAL_SEASON";
    BoardType["GLOBAL_ROUND"] = "GLOBAL_ROUND";
    BoardType["GLOBAL_MONTH"] = "GLOBAL_MONTH";
    BoardType["MINI_LEAGUE"] = "MINI_LEAGUE";
})(BoardType = exports.BoardType || (exports.BoardType = {}));
const { Number, String, ObjectId } = mongoose_1.Schema.Types;
const Status = BoardStatus;
const leaderboardSchema = new mongoose_1.Schema({
    season: { type: ObjectId, ref: "Season", index: true },
    gameRound: { type: Number, index: true },
    year: { type: Number, index: true },
    month: { type: Number, index: true },
    status: {
        type: String,
        enum: [Status.REFRESHED, Status.UPDATING_SCORES, Status.UPDATING_RANKINGS],
        default: Status.REFRESHED
    },
    boardType: {
        type: String,
        enum: [BoardType.GLOBAL_SEASON, BoardType.GLOBAL_MONTH, BoardType.GLOBAL_ROUND, BoardType.MINI_LEAGUE],
    },
    userCount: { type: Number },
    lastStatusUpdate: { type: mongoose_1.Schema.Types.Date }
});
exports.LeaderboardModel = mongoose_1.model('Leaderboard', leaderboardSchema);
//# sourceMappingURL=leaderboard.model.js.map