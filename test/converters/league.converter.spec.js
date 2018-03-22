"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const chai_1 = require("chai");
const league_converter_1 = require("../../src/db/converters/ligi/league.converter");
describe('League Converter', () => {
    describe('Ligi LeagueConverter', () => {
        const converter = new league_converter_1.LeagueConverter();
        const league = {
            name: 'English Premier League',
            slug: 'english_premier_league',
            code: 'epl'
        };
        it('should return an observable when converting', () => {
            let conversion = converter.from(league);
            chai_1.expect(conversion instanceof rxjs_1.Observable).to.equal(true);
        });
        it('should convert correctly', (done) => {
            let conversion = converter.from(league);
            conversion.subscribe(l => {
                chai_1.expect(l.name).to.equal(league.name);
                chai_1.expect(l.slug).to.equal(league.slug);
                chai_1.expect(l.code).to.equal(league.code);
                done();
            });
        });
    });
});
//# sourceMappingURL=league.converter.spec.js.map