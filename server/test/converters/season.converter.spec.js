"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const season_converter_1 = require("../../src/db/converters/ligi/season.converter");
const season_converter_2 = require("../../src/db/converters/apiFootballData/season.converter");
describe('Season Converter', function () {
    this.timeout(5000);
    describe.skip('Ligi SeasonConverter', () => {
        const converter = season_converter_1.SeasonConverter.getInstance();
        const season = {
            name: '2017-2018',
            slug: '17-18',
            year: 2017
        };
        it('should convert correctly', (done) => {
            let conversion = converter.from(season);
            conversion.subscribe(s => {
                chai_1.expect(s.name).to.equal(season.name);
                chai_1.expect(s.slug).to.equal(season.slug);
                done();
            });
        });
    });
    describe('Afd SeasonConverter', () => {
        const converter = new season_converter_2.SeasonConverter();
        const season = {
            id: 445,
            caption: 'Premier League 2017/18',
            league: 'PL',
            year: '2017',
            currentMatchday: 32,
            numberOfMatchdays: 38,
            numberOfTeams: 20,
            numberOfGames: 380,
            lastUpdated: '2018-03-21T08:10:10Z'
        };
        it('should convert correctly', (done) => {
            let conversion = converter.from(season);
            conversion.subscribe(s => {
                chai_1.expect(s.name).to.equal(season.caption);
                chai_1.expect(s.externalReference).to.deep.equal({ API_FOOTBALL_DATA: { id: 445 } });
                done();
            });
        });
    });
});
//# sourceMappingURL=season.converter.spec.js.map