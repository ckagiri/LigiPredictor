"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const season_repo_1 = require("../../../db/repositories/season.repo");
class SeasonUpdater {
    constructor(seasonRepo) {
        this.seasonRepo = seasonRepo;
    }
    static getInstance(provider) {
        return new SeasonUpdater(season_repo_1.SeasonRepository.getInstance(provider));
    }
    updateCurrentMatchRound(seasons) {
        let map = new Map();
        let externalIds = [];
        for (let season of seasons) {
            map[season.id] = season;
            externalIds.push(season.id);
        }
        return this.seasonRepo.getByExternalIds$(externalIds).toPromise();
    }
}
exports.SeasonUpdater = SeasonUpdater;
//# sourceMappingURL=season.updater.js.map