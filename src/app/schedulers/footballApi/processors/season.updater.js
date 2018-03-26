"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const season_repo_1 = require("../../../../db/repositories/season.repo");
class SeasonUpdater {
    constructor(seasonRepo) {
        this.seasonRepo = seasonRepo;
    }
    static getInstance(provider) {
        return new SeasonUpdater(season_repo_1.SeasonRepository.getInstance(provider));
    }
    updateCurrentMatchRound(seasons) {
        throw new Error("Method not implemented.");
    }
}
exports.SeasonUpdater = SeasonUpdater;
//# sourceMappingURL=season.updater.js.map