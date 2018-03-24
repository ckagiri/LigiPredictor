"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const chai_1 = require("chai");
const fixture_converter_1 = require("../../src/db/converters/ligi/fixture.converter");
const fixture_converter_2 = require("../../src/db/converters/apiFootballData/fixture.converter");
const fixture_model_1 = require("../../src/db/models/fixture.model");
describe.only('Fixture Converter', () => {
    describe('Ligi FixtureConverter', () => {
        const converter = new fixture_converter_1.FixtureConverter();
        const fixture = {
            season: '4edd40c86762e0fb12000001',
            date: '2018-05-13T14:00:00Z',
            status: fixture_model_1.FixtureStatus.SCHEDULED,
            matchRound: 38,
            homeTeam: {
                id: '4edd40c86762e0fb12000001',
                name: 'Arsenal',
                slug: 'arsenal'
            },
            awayTeam: {
                id: '4edd40c86762e0fb12000002',
                name: 'Chelsea',
                slug: 'chelsea'
            },
            slug: 'arsenal-chelsea'
        };
        it('should convert correctly', (done) => {
            let conversion = converter.from(fixture);
            conversion.subscribe(t => {
                chai_1.expect(t.slug).to.equal(fixture.slug);
                done();
            });
        });
    });
    describe('Afd FixtureConverter', () => {
        let season = {
            _id: '4edd40c86762e0fb12000001'
        };
        let seasonRepoStub = {
            getByExternalId$: () => {
                return rxjs_1.Observable.of(season);
            }
        };
        let homeTeam = {
            _id: '4edd40c86762e0fb12000001',
            name: 'Arsenal',
            slug: 'arsenal',
            crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Arsenal_FC.svg'
        };
        let teamRepoStub = {
            getByName$: () => {
                return rxjs_1.Observable.of(homeTeam);
            }
        };
        const converter = new fixture_converter_2.FixtureConverter(seasonRepoStub, teamRepoStub);
        const fixture = {
            id: 158952,
            competitionId: 445,
            date: '2018-05-13T14:00:00Z',
            status: 'SCHEDULED',
            matchday: 38,
            homeTeamName: 'Arsenal',
            homeTeamId: 340,
            awayTeamName: 'Chelsea',
            awayTeamId: 65,
            result: {
                goalsHomeTeam: null,
                goalsAwayTeam: null
            },
            odds: null
        };
        it('should convert correctly', (done) => {
            let conversion = converter.from(fixture);
            conversion.subscribe(f => {
                chai_1.expect(f.homeTeam.name).to.equal(homeTeam.name);
                chai_1.expect(f.matchRound).to.equal(fixture.matchday);
                chai_1.expect(f.externalReference).to.deep.equal({ API_FOOTBALL_DATA: { id: 158952 } });
                done();
            });
        });
    });
});
//# sourceMappingURL=fixture.converter.spec.js.map