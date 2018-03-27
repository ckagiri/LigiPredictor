"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const footballApiProvider_1 = require("../../../src/common/footballApiProvider");
const fixture_model_1 = require("../../../src/db/models/fixture.model");
let newFixture = (id, homeTeam, awayTeam, status = fixture_model_1.FixtureStatus.FINISHED) => {
    return {
        homeTeam, awayTeam, status,
        externalReference: {
            [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: { id }
        }
    };
};
let fixtures = [];
let ars_che_td = newFixture(1, 'Arsenal', 'Chelsea');
let liv_sou_td = newFixture(2, 'Liverpool', 'Southampton');
let eve_bur_yd = newFixture(3, 'Everton', 'Burnley', fixture_model_1.FixtureStatus.POSTPONED);
let bou_wat_tm = newFixture(4, 'Bournemouth', 'Watford', fixture_model_1.FixtureStatus.SCHEDULED);
describe('FixturesUpdater', () => {
    describe('Update Game Details', () => {
        it('should update matchResult if changed', () => {
        });
        it('should update matchOdds if changed', () => {
        });
        it('should update matchStatus if changed', () => {
        });
    });
});
//# sourceMappingURL=fixtures.updater.spec.js.map