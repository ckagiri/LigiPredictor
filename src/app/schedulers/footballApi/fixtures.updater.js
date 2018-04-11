"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const fixture_repo_1 = require("../../../db/repositories/fixture.repo");
let fixtureChanged = (apiFixture, dbFixture) => {
    if (apiFixture.status !== dbFixture.status) {
        return true;
    }
    if (apiFixture.result.goalsHomeTeam !== dbFixture.result.goalsHomeTeam ||
        apiFixture.result.goalsAwayTeam !== dbFixture.result.goalsAwayTeam) {
        return true;
    }
    if ((apiFixture.odds && apiFixture.odds.homeWin) !== dbFixture.odds.homeWin ||
        (apiFixture.odds && apiFixture.odds.awayWin) !== dbFixture.odds.awayWin ||
        (apiFixture.odds && apiFixture.odds.draw) !== dbFixture.odds.draw) {
        return true;
    }
    return false;
};
class FixturesUpdater {
    constructor(fixtureRepo) {
        this.fixtureRepo = fixtureRepo;
    }
    static getInstance(provider) {
        return new FixturesUpdater(fixture_repo_1.FixtureRepository.getInstance(provider));
    }
    updateGameDetails(apiFixtures) {
        let externalIdToApiFixtureMap = new Map();
        let externalIds = [];
        for (let apiFixture of apiFixtures) {
            externalIdToApiFixtureMap[apiFixture.id] = apiFixture;
            externalIds.push(apiFixture.id);
        }
        return this.fixtureRepo.findByExternalIds$(externalIds)
            .flatMap((dbFixtures) => {
            return rxjs_1.Observable.from(dbFixtures);
        })
            .flatMap((dbFixture) => {
            let provider = this.fixtureRepo.Provider;
            let extId = dbFixture['externalReference'][provider]['id'];
            let apiFixture = externalIdToApiFixtureMap[extId];
            if (fixtureChanged(apiFixture, dbFixture)) {
                let id = dbFixture.id;
                let { result, status, odds } = apiFixture;
                let update = { result: result, status, odds: odds };
                Object.keys(update).forEach(key => update[key] == null && delete update[key]);
                return this.fixtureRepo.findByIdAndUpdate$(id, update);
            }
            return rxjs_1.Observable.of(dbFixture);
        }).toPromise();
    }
}
exports.FixturesUpdater = FixturesUpdater;
//# sourceMappingURL=fixtures.updater.js.map