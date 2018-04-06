import { expect } from 'chai';

import { ILeagueRepository, LeagueRepository } from '../../src/db/repositories/league.repo';
import { ISeasonRepository, SeasonRepository } from '../../src/db/repositories/season.repo';
import { config } from '../../src/config/environment/index'
import * as db from '../../src/db/index';
import { FootballApiProvider as ApiProvider } from '../../src/common/footballApiProvider';

const epl = {
  name: 'English Premier League',
  slug: 'english_premier_league',
  code: 'epl'
}

let epl17 = {
  name: "2017-2018",
  slug: "17-18",
  year: 2017,
  seasonStart: '2017-08-11T00:00:00+0200',
  seasonEnd: '2018-05-13T16:00:00+0200',
  leagueId: null
}

describe('seasonRepo', function() {
  this.timeout(5000);
  before(function(done) {
    db.init(config.mongo.uri, done, { drop: true });
  })
  afterEach(function(done) {
    db.drop().then(function() {
      done();      
    })
  })
  after(function(done) {
    db.close().then(function() {
      done();
    })
  })

  it('should save new season', function (done) {
    let leagueRepo = LeagueRepository.getInstance(ApiProvider.LIGI);
    let seasonRepo = SeasonRepository.getInstance(ApiProvider.LIGI)

    leagueRepo.save$(epl)
      .flatMap((l: any) => {
        epl17.leagueId = l._id;
        return seasonRepo.save$(epl17);
      })
      .subscribe((data: any) => {
        let { league, name, slug, year } = data
        expect(name).to.equal(epl17.name)
        expect(slug).to.equal(epl17.slug)
        //expect(year).to.equal(epl17.year)
        expect(league.name).to.equal(epl.name)
        expect(league.slug).to.equal(epl.slug)
        done();
      }, (err) => { console.log(err); done(); });
   });
})
