"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fixture_repo_1 = require("../../../db/repositories/fixture.repo");
class FixturesUpdater {
    constructor(fixtureRepo) {
        this.fixtureRepo = fixtureRepo;
    }
    static getInstance(provider) {
        return new FixturesUpdater(fixture_repo_1.FixtureRepository.getInstance(provider));
    }
    updateGameDetails(fixtures) {
        throw new Error("Method not implemented.");
    }
}
exports.FixturesUpdater = FixturesUpdater;
//# sourceMappingURL=fixtures.updater.js.map