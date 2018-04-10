import { expect } from 'chai';

import { config } from '../../src/config/environment/index'
import * as db from '../../src/db/index';
import { LeagueModel as League } from '../../src/db/models/league.model';
import { SeasonModel as Season } from '../../src/db/models/season.model';

import { FootballApiProvider as ApiProvider } from '../../src/common/footballApiProvider';
import { ISeasonRepository, SeasonRepository } from '../../src/db/repositories/season.repo';

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
  currentMatchRound: 20,
  league: null,
  leagueId: null
}

let epl16 = {
  name: "2016-2017",
  slug: "16-17",
  year: 2016,
  seasonStart: '2016-08-11T00:00:00+0200',
  seasonEnd: '2017-05-13T16:00:00+0200',
  currentMatchRound: 20,
  leagueId: null
}

const afdEpl17 = {
  id: 445,
  caption: 'Premier League 2017/18',
  league: 'PL',
  year: '2017',
  currentMatchday: 32,
  numberOfMatchdays: 38,
  numberOfTeams: 20,
  numberOfGames: 380,
}

const afdEpl16 = {
  id: 441,
  caption: 'Premier League 2016/17',
  league: 'PL',
  year: '2016',
  currentMatchday: 32,
  numberOfMatchdays: 38,
  numberOfTeams: 20,
  numberOfGames: 380
}
let league: any;

describe('seasonRepo', function() {
  this.timeout(5000);
  before((done) => {
    db.init(config.testDb.uri, done, { drop: true });
  })
  beforeEach(done => {
    League.create(epl)
    .then(l => {
      league = l;
      done();
    })
  })
  afterEach((done) => {
    db.drop().then(() => {
      done();      
    })
  })
  after((done) => {
    db.close().then(() => {
      done();
    })
  })

  it('should save new season', (done) => {
    let seasonRepo = SeasonRepository.getInstance(ApiProvider.LIGI)
    epl17.leagueId = league._id;
    
    seasonRepo.save$(epl17)
      .subscribe((data: any) => {
        let { league, name, slug, year } = data
        expect(name).to.equal(epl17.name)
        expect(slug).to.equal(epl17.slug)
        expect(year).to.equal(epl17.year)
        expect(league.name).to.equal(epl.name)
        expect(league.slug).to.equal(epl.slug)
        done();
      }, (err) => { console.log(err); done(); });
   });

   it('should find by externalId', (done) => {
    let seasonRepo = SeasonRepository.getInstance(ApiProvider.API_FOOTBALL_DATA)
    let { _id, name, slug } = league;
    epl17['league'] = { id: _id, name, slug };
    epl17['externalReference'] = { [ApiProvider.API_FOOTBALL_DATA]: { id: afdEpl17.id } }
    
    seasonRepo.insert$(epl17)
      .flatMap(_ => {
        return seasonRepo.findByExternalId$(afdEpl17.id)
      })
      .subscribe(s => {
        expect(s.externalReference).to.deep.equal(epl17['externalReference'])
        done();
      })
  })

  it('should find by externalIds', (done) => {
    let seasonRepo = SeasonRepository.getInstance(ApiProvider.API_FOOTBALL_DATA)
    let { _id, name, slug } = league    
    epl17['league'] = epl16['league'] = { id: _id, name, slug };
    epl17['externalReference'] = { [ApiProvider.API_FOOTBALL_DATA]: { id: afdEpl17.id } }
    epl16['externalReference'] = { [ApiProvider.API_FOOTBALL_DATA]: { id: afdEpl16.id } }
    
    seasonRepo.insertMany$([epl16, epl17])
      .flatMap(_ => {
        return seasonRepo.findByExternalIds$([afdEpl16.id, afdEpl17.id]);
      })
      .subscribe(data => {
        expect(data[0].externalReference).to.deep.equal(epl16['externalReference'])
        expect(data[1].externalReference).to.deep.equal(epl17['externalReference']);        
        done();
      })
  })

  it('should findByIdAndUpdate currentMatchRound', (done) => {
    let seasonRepo = SeasonRepository.getInstance(ApiProvider.LIGI)
    epl17.leagueId = league._id;
    
    seasonRepo.save$(epl17)
      .flatMap(s => {
        let update = { currentMatchRound: 21 };
        return seasonRepo.findByIdAndUpdate$(s.id, update);
      })
      .subscribe(s => {
        expect(s.currentMatchRound).to.equal(21);
        done();
      })    
  })

  it('should findByExternalIdAndUpdate currentMatchRound', (done) => {
    let seasonRepo = SeasonRepository.getInstance(ApiProvider.API_FOOTBALL_DATA)
    let { _id, name, slug } = league;
    epl17['league'] = { id: _id, name, slug };
    epl17['externalReference'] = { [ApiProvider.API_FOOTBALL_DATA]: { id: afdEpl17.id } }
    
    seasonRepo.insert$(epl17)
      .flatMap(s => {
        afdEpl17.currentMatchday = 21;
        return seasonRepo.findByExternalIdAndUpdate$(afdEpl17);
      })
      .subscribe(s => {
        expect(s.currentMatchRound).to.equal(21);
        done();
      })    
  })

  it('should findByExternalIdAndUpdate currentMatchRound (version2)', (done) => {
    let seasonRepo = SeasonRepository.getInstance(ApiProvider.API_FOOTBALL_DATA)
    let { _id, name, slug } = league;
    epl17['league'] = { id: _id, name, slug };
    epl17['externalReference'] = { [ApiProvider.API_FOOTBALL_DATA]: { id: afdEpl17.id } }
    
    seasonRepo.insert$(epl17)
      .flatMap(s => {
        let update = { currentMatchRound: 21 };      
        return seasonRepo.findByExternalIdAndUpdate$(afdEpl17.id, update);
      })
      .subscribe(s => {
        expect(s.currentMatchRound).to.equal(21);
        done();
      })    
  })

  it('should findByExternalIdAndUpdate while preserving ExternalReference', (done) => {
    let seasonRepo = SeasonRepository.getInstance(ApiProvider.API_FOOTBALL_DATA)
    let { _id, name, slug } = league;
    epl17['league'] = { id: _id, name, slug };
    epl17['externalReference'] = { 
      ['SomeOtherApi']: { id: 'someExternalId' },
      [ApiProvider.API_FOOTBALL_DATA]: { id: afdEpl17.id }
    }
    
    seasonRepo.insert$(epl17)
      .flatMap(s => {        
        afdEpl17.currentMatchday = 21
        return seasonRepo.findByExternalIdAndUpdate$(afdEpl17);
      })
      .subscribe(s => {
        expect(s.currentMatchRound).to.equal(21);
        expect(s.externalReference).to.deep.equal(epl17['externalReference'])
        done();
      })     
  })
})
