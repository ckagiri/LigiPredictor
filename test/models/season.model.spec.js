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
            it('should not require a code', (done) => {
                s.validate((err) => {
                    chai_1.expect(err.errors.code).to.not.exist;
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=season.model.spec.js.map