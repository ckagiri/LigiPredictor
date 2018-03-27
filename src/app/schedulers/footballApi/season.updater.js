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
        return this.seasonRepo.getByExternalIds$(externalIds)
            .flatMap((dbSeasons) => {
            return rxjs_1.Observable.from(dbSeasons);
        })
            .flatMap((dbSeason) => {
            let provider = this.seasonRepo.Converter.provider;
            let extId = dbSeason['externalReference'][provider]['id'];
            let extCurrentRound = externalIdToSeasonMap[extId].currentMatchRound;
            if (dbSeason.currentMatchRound !== extCurrentRound) {
                let id = dbSeason['_id'];
                let update = { $set: { currentMatchRound: extCurrentRound } };
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