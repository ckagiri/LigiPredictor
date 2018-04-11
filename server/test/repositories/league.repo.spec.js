"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const db = require("../../src/db/index");
const index_1 = require("../../src/config/environment/index");
const footballApiProvider_1 = require("../../src/common/footballApiProvider");
const league_repo_1 = require("../../src/db/repositories/league.repo");
const league = {
    name: 'English Premier League',
    slug: 'english_premier_league',
    code: 'epl'
};
describe('LeagueRepo', function () {
    this.timeout(5000);
    before((done) => {
        db.init(index_1.config.testDb.uri, done, { drop: true });
    });
    afterEach((done) => {
        db.drop().then(() => {
            done();
        });
    });
    after((done) => {
        db.close().then(() => {
            done();
        });
    });
    it('should save new league', (done) => {
        let leagueRepo = league_repo_1.LeagueRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        leagueRepo.save$(league)
            .subscribe((data) => {
            let { name, slug, code } = data;
            chai_1.expect(name).to.equal(league.name);
            chai_1.expect(slug).to.equal(league.slug);
            chai_1.expect(code).to.equal(league.code);
            done();
        }, (err) => { console.log(err); done(); });
    });
});
//# sourceMappingURL=league.repo.spec.js.map