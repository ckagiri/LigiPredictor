"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const league_repo_1 = require("../../src/db/repositories/league.repo");
const season_repo_1 = require("../../src/db/repositories/season.repo");
const index_1 = require("../../src/config/environment/index");
const db = require("../../src/db/index");
const footballApiProvider_1 = require("../../src/common/footballApiProvider");
const epl = {
    name: 'English Premier League',
    slug: 'english_premier_league',
    code: 'epl'
};
let epl17 = {
    name: "2017-2018",
    slug: "17-18",
    year: 2017,
    seasonStart: '2017-08-11T00:00:00+0200',
    seasonEnd: '2018-05-13T16:00:00+0200',
    leagueId: null
};
describe.only('seasonRepo', function () {
    this.timeout(5000);
    before((done) => {
        db.init(index_1.config.mongo.uri, done, { drop: true });
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
    it('should save new season', function (done) {
        let leagueRepo = league_repo_1.LeagueRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        let seasonRepo = season_repo_1.SeasonRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        leagueRepo.save$(epl)
            .flatMap((l) => {
            epl17.leagueId = l._id;
            return seasonRepo.save$(epl17);
        })
            .subscribe((data) => {
            let { league, name, slug, year } = data;
            chai_1.expect(name).to.equal(epl17.name);
            chai_1.expect(slug).to.equal(epl17.slug);
            chai_1.expect(year).to.equal(epl17.year);
            chai_1.expect(league.name).to.equal(epl.name);
            chai_1.expect(league.slug).to.equal(epl.slug);
            done();
        }, (err) => { console.log(err); done(); });
    });
});
//# sourceMappingURL=season.repo.spec.js.map