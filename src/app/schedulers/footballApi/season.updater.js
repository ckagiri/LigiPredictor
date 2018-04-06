"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const season_repo_1 = require("../../../db/repositories/season.repo");
class SeasonUpdater {
    constructor(seasonRepo) {
        this.seasonRepo = seasonRepo;
    }
    static getInstance(provider) {
        return new SeasonUpdater(season_repo_1.SeasonRepository.getInstance(provider));
    }
    updateCurrentMatchRound(seasons) {
        let externalIdToSeasonMap = new Map();
        let externalIds = [];
        for (let season of seasons) {
            externalIdToSeasonMap[season.id] = season;
            externalIds.push(season.id);
        }
        return this.seasonRepo.findByExternalIds$(externalIds)
            .flatMap((dbSeasons) => {
            return rxjs_1.Observable.from(dbSeasons);
        })
            .flatMap((dbSeason) => {
            let provider = this.seasonRepo.Provider;
            let extId = dbSeason['externalReference'][provider]['id'];
            let extCurrentMatchRound = externalIdToSeasonMap[extId].currentMatchRound;
            if (dbSeason.currentMatchRound !== extCurrentMatchRound) {
                let id = dbSeason['_id'];
                let update = { currentMatchRound: extCurrentMatchRound };
                return this.seasonRepo.findByIdAndUpdate$(id, update);
            }
            else {
                return rxjs_1.Observable.of(dbSeason);
            }
        }).toPromise();
    }
}
exports.SeasonUpdater = SeasonUpdater;
//# sourceMappingURL=season.updater.js.map