"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const chai_1 = require("chai");
const league_model_1 = require("../../src/db/models/league.model");
const league_repo_1 = require("../../src/db/repositories/league.repo");
describe('LeagueRepo', () => {
    let repo;
    before(() => {
        mongoose.connect('mongodb://localhost:27017/test123-test');
        mongoose.Promise = global.Promise;
        repo = new league_repo_1.LeagueRepository();
    });
    after((done) => {
        league_model_1.LeagueModel.remove({}, (err) => {
            mongoose.disconnect();
            done();
        });
    });
    describe('save$', () => {
        it('should save a new league', (done) => {
            const league = {
                name: 'English Premier League',
                slug: 'english_premier_league',
                code: 'epl'
            };
            repo.save$(league).subscribe(l => {
                chai_1.assert.notEqual(l._id, undefined);
                chai_1.assert.equal(l.name, league.name);
                chai_1.assert.equal(l.slug, league.slug);
                chai_1.assert.equal(l.code, league.code);
                done();
            });
        });
    });
});
//# sourceMappingURL=league.repo.spec.js.map