"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const season_model_1 = require("../../src/db/models/season.model");
describe('Season', () => {
    describe('schema', () => {
        describe('an empty season', () => {
            const s = new season_model_1.SeasonModel();
            it('should have a mongoose schema', function () {
                chai_1.expect(s.schema).to.not.be.undefined;
            });
            it('should require a name', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors.name).to.exist;
                    done();
                });
            });
            it('should require a slug', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors.slug).to.exist;
                    done();
                });
            });
            it('should require year', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors.year).to.exist;
                    done();
                });
            });
            it('should require partial league info', () => {
            });
        });
        describe('a partial season', () => {
            const season = {
                name: '2017-2018',
                slug: '17-18',
                year: 2017
            };
            const s = new season_model_1.SeasonModel(season);
            it('should have 0 errors', (done) => {
                s.validate((err) => {
                    console.log(err);
                    chai_1.expect(err).to.not.exist;
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=season.model.spec.js.map