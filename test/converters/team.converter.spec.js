"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const team_converter_1 = require("../../src/db/converters/ligi/team.converter");
const team_converter_2 = require("../../src/db/converters/apiFootballData/team.converter");
describe('Team Converter', () => {
    describe('Ligi TeamConverter', () => {
        const converter = new team_converter_1.TeamConverter();
        const team = {
            name: 'Manchester United FC',
            shortName: 'Man United',
            code: 'MUN',
            slug: 'man_united',
            crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Manchester_United_FC.svg',
            aliases: ['ManU', 'ManUtd']
        };
        it('should convert correctly', (done) => {
            let conversion = converter.from(team);
            conversion.subscribe(t => {
                chai_1.expect(t.name).to.equal(team.name);
                chai_1.expect(t.slug).to.equal(team.slug);
                done();
            });
        });
    });
    describe('Afd TeamConverter', () => {
        const converter = new team_converter_2.TeamConverter();
        const team = {
            id: 66,
            name: 'Manchester United FC',
            shortName: 'ManU',
            squadMarketValue: null,
            crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Manchester_United_FC.svg'
        };
        it('should convert correctly', (done) => {
            let conversion = converter.from(team);
            conversion.subscribe(t => {
                chai_1.expect(t.name).to.equal(team.name);
                chai_1.expect(t.crestUrl).to.equal(team.crestUrl);
                chai_1.expect(t.externalReference).to.deep.equal({ API_FOOTBALL_DATA: { id: 66 } });
                done();
            });
        });
    });
});
//# sourceMappingURL=team.converter.spec.js.map