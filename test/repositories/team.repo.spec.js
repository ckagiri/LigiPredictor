"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const team_repo_1 = require("../../src/db/repositories/team.repo");
const index_1 = require("../../src/config/environment/index");
const db = require("../../src/db/index");
const footballApiProvider_1 = require("../../src/common/footballApiProvider");
const manu = {
    name: 'Manchester United FC',
    shortName: 'Man United',
    code: 'MUN',
    slug: 'man_united',
    crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Manchester_United_FC.svg',
    aliases: ['ManU', 'ManUtd']
};
const manc = {
    name: 'Manchester City FC',
    shortName: 'Man City',
    code: 'MCI',
    slug: 'man_city',
    crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Manchester_City_FC.svg',
    aliases: ['ManCity']
};
const afdManu = {
    id: 66,
    name: 'Manchester United FC',
    shortName: 'ManU',
    squadMarketValue: null,
    crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Manchester_United_FC.svg'
};
const afdManc = {
    id: 67,
    name: 'Manchester City FC',
    shortName: 'ManCity',
    squadMarketValue: null,
    crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Manchester_City_FC.svg'
};
describe('teamRepo', function () {
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
    it('should save a new Team', (done) => {
        let teamRepo = team_repo_1.TeamRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        teamRepo.save$(manu)
            .subscribe((t) => {
            chai_1.expect(t.name).to.equal(manu.name);
            chai_1.expect(t.slug).to.equal(manu.slug);
            chai_1.expect(t.aliases).to.contain('ManU', 'ManUtd');
            chai_1.expect(t.aliases).to.have.length(2);
            done();
        }, (err) => { console.log(err); done(); });
    });
    it('should findByName$ using name', (done) => {
        let teamRepo = team_repo_1.TeamRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
        teamRepo.insert$(manu)
            .flatMap(_ => {
            return teamRepo.findByName$(manu.name);
        })
            .subscribe((t) => {
            chai_1.expect(t.name).to.equal(manu.name);
            done();
        }, (err) => { console.log(err); done(); });
    });
    it('should findByName$ using shortName', (done) => {
        let teamRepo = team_repo_1.TeamRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
        teamRepo.insert$(manu)
            .flatMap(_ => {
            return teamRepo.findByName$(manu.shortName);
        })
            .subscribe((t) => {
            chai_1.expect(t.name).to.equal(manu.name);
            done();
        }, (err) => { console.log(err); done(); });
    });
    it('should findByName$ using alias', (done) => {
        let teamRepo = team_repo_1.TeamRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
        teamRepo.insert$(manu)
            .flatMap(_ => {
            return teamRepo.findByName$(manu.aliases[0]);
        })
            .subscribe((t) => {
            chai_1.expect(t.name).to.equal(manu.name);
            done();
        }, (err) => { console.log(err); done(); });
    });
    it('should findByNameAndUpsert', (done) => {
        let teamRepo = team_repo_1.TeamRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
        teamRepo.insert$(manu)
            .flatMap(_ => {
            return teamRepo.findByNameAndUpsert$(afdManu);
        })
            .subscribe((t) => {
            chai_1.expect(t.name).to.equal(manu.name);
            chai_1.expect(t.externalReference).to.have.ownProperty(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
            done();
        }, (err) => { console.log(err); done(); });
    });
    it('should retain external reference when findByNameAndUpsert', (done) => {
        let teamRepo = team_repo_1.TeamRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
        manu['externalReference'] = { 'SomeOtherApi': { id: 'someExternalId' } };
        teamRepo.insert$(manu)
            .flatMap(_ => {
            return teamRepo.findByNameAndUpsert$(afdManu);
        })
            .subscribe(t => {
            chai_1.expect(t.name).to.equal(manu.name);
            chai_1.expect(t.externalReference).to.have.ownProperty("SomeOtherApi");
            chai_1.expect(t.externalReference).to.have.ownProperty(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
            done();
        }, (err) => { console.log(err); done(); });
    });
    it('should findEachByNameAndUpdate', (done) => {
        let teamRepo = team_repo_1.TeamRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        teamRepo.insertMany$([manu, manc])
            .flatMap(_ => {
            return teamRepo.findEachByNameAndUpsert$([afdManu, afdManc]);
        })
            .subscribe((ts) => {
            chai_1.expect(ts[0].name).to.equal(manu.name);
            chai_1.expect(ts[1].name).to.equal(manc.name);
            done();
        }, (err) => { console.log(err); done(); });
    });
});
//# sourceMappingURL=team.repo.spec.js.map