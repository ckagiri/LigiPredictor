"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fixture_model_1 = require("../../src/db/models/fixture.model");
describe('Fixture', () => {
    describe('schema', () => {
        describe('an empty fixture', () => {
            const s = new fixture_model_1.FixtureModel();
            it('should have a mongoose schema', function () {
                chai_1.expect(s.schema).to.not.be.undefined;
            });
            it('should require a slug', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors.slug).to.exist;
                    done();
                });
            });
            it('should require a date', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors.date).to.exist;
                    done();
                });
            });
            it('should require matchRound', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors.matchRound).to.exist;
                    done();
                });
            });
            it('should require gameRound', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors.gameRound).to.exist;
                    done();
                });
            });
            it('should require a home team', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors['homeTeam.id']).to.exist;
                    done();
                });
            });
            it('should require an away team', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors['awayTeam.id']).to.exist;
                    done();
                });
            });
            it('should require status', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors.status).to.exist;
                    done();
                });
            });
        });
        describe('a fixture', () => {
            const fixture = {
                season: '4edd40c86762e0fb12000001',
                date: '2018-05-13T14:00:00Z',
                status: fixture_model_1.FixtureStatus.SCHEDULED,
                matchRound: 38,
                gameRound: 38,
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
            const f = new fixture_model_1.FixtureModel(fixture);
            it('should have 0 errors', (done) => {
                f.validate((err) => {
                    chai_1.expect(err).to.not.exist;
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=fixture.model.spec.js.map