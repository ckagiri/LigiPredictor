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
    currentMatchRound: 20,
    leagueId: null
};
let epl16 = {
    name: "2016-2017",
    slug: "16-17",
    year: 2016,
    seasonStart: '2016-08-11T00:00:00+0200',
    seasonEnd: '2017-05-13T16:00:00+0200',
    currentMatchRound: 20,
    leagueId: null
};
const afdEpl17 = {
    id: 445,
    caption: 'Premier League 2017/18',
    league: 'PL',
    year: '2017',
    currentMatchday: 32,
    numberOfMatchdays: 38,
    numberOfTeams: 20,
    numberOfGames: 380,
};
const afdEpl16 = {
    id: 441,
    caption: 'Premier League 2016/17',
    league: 'PL',
    year: '2016',
    currentMatchday: 32,
    numberOfMatchdays: 38,
    numberOfTeams: 20,
    numberOfGames: 380
};
describe('seasonRepo', function () {
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
    it('should save new season', (done) => {
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
    it('should find by externalId', (done) => {
        let leagueRepo = league_repo_1.LeagueRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        let seasonRepo = season_repo_1.SeasonRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
        leagueRepo.save$(epl)
            .flatMap((l) => {
            epl17['league'] = { id: l._id, name: l.name, slug: l.slug };
            epl17['externalReference'] = {
                [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: {
                    id: afdEpl17.id
                }
            };
            return seasonRepo.insert$(epl17);
        })
            .flatMap(_ => {
            return seasonRepo.findByExternalId$(afdEpl17.id);
        })
            .subscribe(s => {
            chai_1.expect(s.externalReference).to.deep.equal(epl17['externalReference']);
            done();
        });
    });
    it('should find by externalIds', (done) => {
        let leagueRepo = league_repo_1.LeagueRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        let seasonRepo = season_repo_1.SeasonRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
        leagueRepo.save$(epl)
            .flatMap((l) => {
            epl17['league'] = epl16['league'] = { id: l._id, name: l.name, slug: l.slug };
            epl17['externalReference'] = {
                [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: {
                    id: afdEpl17.id
                }
            };
            epl16['externalReference'] = {
                [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: {
                    id: afdEpl16.id
                }
            };
            return seasonRepo.insertMany$([epl16, epl17]);
        })
            .flatMap(_ => {
            return seasonRepo.findByExternalIds$([afdEpl16.id, afdEpl17.id]);
        })
            .subscribe(data => {
            chai_1.expect(data[0].externalReference).to.deep.equal(epl16['externalReference']);
            chai_1.expect(data[1].externalReference).to.deep.equal(epl17['externalReference']);
            done();
        });
    });
    it('should findByIdAndUpdate currentMatchRound', (done) => {
        let leagueRepo = league_repo_1.LeagueRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        let seasonRepo = season_repo_1.SeasonRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        leagueRepo.save$(epl)
            .flatMap((l) => {
            epl17.leagueId = l._id;
            return seasonRepo.save$(epl17);
        })
            .flatMap(s => {
            let update = { currentMatchRound: 21 };
            return seasonRepo.findByIdAndUpdate$(s['_id'], update);
        })
            .subscribe(s => {
            chai_1.expect(s.currentMatchRound).to.equal(21);
            done();
        });
    });
    it('should findByExternalIdAndUpdate currentMatchRound', (done) => {
        let leagueRepo = league_repo_1.LeagueRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        let seasonRepo = season_repo_1.SeasonRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
        leagueRepo.save$(epl)
            .flatMap((l) => {
            epl17['league'] = { id: l._id, name: l.name, slug: l.slug };
            epl17['externalReference'] = {
                [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: {
                    id: afdEpl17.id
                }
            };
            return seasonRepo.insert$(epl17);
        })
            .flatMap(s => {
            afdEpl17.currentMatchday = 21;
            return seasonRepo.findByExternalIdAndUpdate$(afdEpl17);
        })
            .subscribe(s => {
            chai_1.expect(s.currentMatchRound).to.equal(21);
            done();
        });
    });
    it('should findByExternalIdAndUpdate currentMatchRound (version2)', (done) => {
        let leagueRepo = league_repo_1.LeagueRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        let seasonRepo = season_repo_1.SeasonRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
        leagueRepo.save$(epl)
            .flatMap((l) => {
            epl17['league'] = { id: l._id, name: l.name, slug: l.slug };
            epl17['externalReference'] = {
                [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: {
                    id: afdEpl17.id
                }
            };
            return seasonRepo.insert$(epl17);
        })
            .flatMap(s => {
            let update = { currentMatchRound: 21 };
            return seasonRepo.findByExternalIdAndUpdate$(afdEpl17.id, update);
        })
            .subscribe(s => {
            chai_1.expect(s.currentMatchRound).to.equal(21);
            done();
        });
    });
    it('should findByExternalIdAndUpdate while preserving ExternalReference', (done) => {
        let leagueRepo = league_repo_1.LeagueRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        let seasonRepo = season_repo_1.SeasonRepository.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
        leagueRepo.save$(epl)
            .flatMap((l) => {
            epl17['league'] = { id: l._id, name: l.name, slug: l.slug };
            epl17['externalReference'] = {
                ['SomeOtherApi']: {
                    id: 'someExternalId'
                },
                [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: {
                    id: afdEpl17.id
                }
            };
            return seasonRepo.insert$(epl17);
        })
            .flatMap(s => {
            afdEpl17.currentMatchday = 21;
            return seasonRepo.findByExternalIdAndUpdate$(afdEpl17);
        })
            .subscribe(s => {
            chai_1.expect(s.currentMatchRound).to.equal(21);
            chai_1.expect(s.externalReference).to.deep.equal(epl17['externalReference']);
            done();
        });
    });
});
//# sourceMappingURL=season.repo.spec.js.map