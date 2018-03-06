"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const chai_1 = require("chai");
const league_converter_ligi_1 = require("../../src/db/converters/league.converter.ligi");
describe.only('League Converter', () => {
    let converter;
    let afdLeague;
    before(() => {
        converter = new league_converter_ligi_1.LigiLeagueConverter();
        afdLeague = {
            name: 'English Premier League',
            slug: 'english_premier_league',
            code: 'epl'
        };
    });
    it('should return an observable when converting', () => {
        let conversion = converter.convert({});
        chai_1.expect(conversion instanceof rxjs_1.Observable).to.equal(true);
    });
    it('should convert correctly', (done) => {
        let conversion = converter.convert(afdLeague);
        conversion.subscribe((l) => {
            chai_1.assert.equal(l.name, afdLeague.name);
            chai_1.assert.equal(l.slug, afdLeague.slug);
            chai_1.assert.equal(l.code, afdLeague.code);
            done();
        });
    });
});
//# sourceMappingURL=league.converter.spec.js.map