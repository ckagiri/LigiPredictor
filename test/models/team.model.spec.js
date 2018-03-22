"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const team_model_1 = require("../../src/db/models/team.model");
describe('Team', () => {
    describe('schema', () => {
        describe('an empty team', () => {
            const s = new team_model_1.TeamModel();
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
        });
        describe('a team', () => {
            const team = {
                name: 'Manchester United FC',
                shortName: 'Man United',
                code: 'MUN',
                slug: 'man_united',
                crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Manchester_United_FC.svg',
                aliases: ['ManU', 'ManUtd']
            };
            const t = new team_model_1.TeamModel(team);
            it('should have 0 errors', (done) => {
                t.validate((err) => {
                    chai_1.expect(err).to.not.exist;
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=team.model.spec.js.map