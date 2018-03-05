"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const league_1 = require("../../src/db/models/league");
describe.only('League', () => {
    describe('schema', () => {
        describe('an empty league', () => {
            const l = new league_1.League();
            it('should have a mongoose schema', function () {
                chai_1.expect(l.schema).not.be.undefined;
            });
            it('should require a name', (done) => {
                l.validate((err) => {
                    chai_1.expect(err.errors.name).to.exist;
                    done();
                });
            });
            it('should require a slug', (done) => {
                l.validate((err) => {
                    chai_1.expect(err.errors.slug).to.exist;
                    done();
                });
            });
            it('should not require a code', (done) => {
                l.validate((err) => {
                    chai_1.expect(err.errors.code).to.not.exist;
                    done();
                });
            });
        });
        describe('a full league', () => {
            const n = {
                name: 'English Premier League',
                slug: 'english_premier_league',
                code: 'epl'
            };
            const l = new league_1.League(n);
            it('should have 0 errors', (done) => {
                l.validate((err) => {
                    chai_1.expect(err).to.eql(null);
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=league.js.map