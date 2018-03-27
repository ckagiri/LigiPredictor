"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const season_updater_1 = require("../../../src/app/schedulers/footballApi/season.updater");
const footballApiProvider_1 = require("../../../src/common/footballApiProvider");
let seasonRepoStub = {
    provider: footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA,
    findByIdAndUpdate$: () => { },
    getByExternalId$: () => { }
};
let newSeason = () => {
    return {
        currentMatchRound: 1,
        externalReference: {
            [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: { id: 1 }
        }
    };
};
let dbSeason = newSeason();
let apiSeason = newSeason();
apiSeason.currentMatchRound = 2;
let dbSeasons = [dbSeason];
let apiSeasons = [apiSeason];
let seasonUpdater = new season_updater_1.SeasonUpdater(seasonRepoStub);
describe('SeasonUpdater', () => {
    describe('updateCurrentMatchRound', () => {
        //seasonUpdater.updateCurrentMatchRound(apiSeasons)
        it('should get seasons by externalId', () => {
        });
        it('should update currentRound of season if different from stored', () => {
        });
        it('should not update currentRound if similar', () => {
        });
    });
});
//# sourceMappingURL=season.updater.js.map