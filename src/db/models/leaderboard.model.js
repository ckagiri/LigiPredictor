"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var LeaderboardStatus;
(function (LeaderboardStatus) {
    LeaderboardStatus["UPDATING_SCORES"] = "UPDATING_SCORES";
    LeaderboardStatus["UPDATING_RANKINGS"] = "UPDATING_RANKINGS";
    LeaderboardStatus["REFRESHED"] = "REFRESHED";
})(LeaderboardStatus = exports.LeaderboardStatus || (exports.LeaderboardStatus = {}));
const leaderboardSchema = new mongoose_1.Schema({});
exports.LeaderboardModel = mongoose_1.model('Leaderboard', leaderboardSchema);
//# sourceMappingURL=leaderboard.model.js.map