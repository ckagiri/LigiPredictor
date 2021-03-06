import { Observable } from 'rxjs'
import { expect } from 'chai';

import * as db from '../../src/db/index';
import { config } from '../../src/config/environment/index'
import { FootballApiProvider as ApiProvider } from '../../src/common/footballApiProvider';
import { LeagueModel as League } from '../../src/db/models/league.model';
import { SeasonModel as Season } from '../../src/db/models/season.model';
import { TeamModel as Team } from '../../src/db/models/team.model';

import { FixtureRepository } from '../../src/db/repositories/fixture.repo';

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
  currentGameRound: 20,
  league: null,
  externalReference: null
}

const afdEpl17 = {
  id: 445,
  caption: 'Premier League 2017/18',
  league: 'PL',
  year: '2017',
  currentMatchday: 20,
  numberOfMatchdays: 38,
  numberOfTeams: 20,
  numberOfGames: 380,
}

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

const manuVmanc = {
  date: "2017-09-10T11:30:00Z",
  status: "SCHEDULED",
  matchRound: 20,
  gameRound: 20,
  seasonId: null,
  homeTeamId: null,
  awayTeamId: null,
  result: {}
}

const afd_manuVmanc = {
  id: 150809,
  competitionId: 445,
  date: "2017-09-10T11:30:00Z",
  status: "FINISHED",
  matchday: 20,
  homeTeamName: "Manchester United FC",
  homeTeamId: 66,
  awayTeamName: "Manchester City FC",
  awayTeamId: 65,
  result: {
    "goalsHomeTeam": 1,
    "goalsAwayTeam": 2
  },
  odds: {
    "homeWin": 2.3,
    "draw": 3.25,
    "awayWin": 3.4
  }
}
let fixtureRepo = FixtureRepository.getInstance(ApiProvider.API_FOOTBALL_DATA)
let ligiFixtureRepo = FixtureRepository.getInstance(ApiProvider.LIGI)
let league: any, season: any, team1: any, team2: any, fixture: any;

describe('FixtureRepo', function() {
  this.timeout(5000);
  before((done) => {
    db.init(config.testDb.uri, done, { drop: true });
  })
  beforeEach((done) => {
    League.create(epl)
      .then(l => {
        league = l;
        let { name, slug, id } = l;
        epl17.league = { name, slug, id };
        epl17['league'] = { id: league.id, name: league.name, slug: league.slug }
        epl17['externalReference'] = { [ApiProvider.API_FOOTBALL_DATA]: { id: afdEpl17.id } }
        return Season.create(epl17);
      })
      .then(s => {
        season = s;
        return Team.create([manu, manc])
      })
      .then(teams => {
        team1 = teams[0]; team2 = teams[1]; 
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
  it('should save a fixture', (done) => {
    manuVmanc.seasonId = season.id;
    manuVmanc.homeTeamId = team1.id;
    manuVmanc.awayTeamId = team2.id;
    
    ligiFixtureRepo.save$(manuVmanc)
      .subscribe(fixture => {
        expect(fixture.season.toString()).to.equal(season.id)
        expect(fixture.slug).to.equal(`${team1.slug}-${team2.slug}`)
        done();
      })
  })

  it('should findEach By SeasonAndTeams AndUpdateOrCreate', (done) => {
    fixtureRepo.findBySeasonAndTeamsAndUpsert$(afd_manuVmanc)
      .subscribe(fixture => {
        expect(fixture.season.toString()).to.equal(season.id)
        expect(fixture.slug).to.equal(`${team1.slug}-${team2.slug}`)
        done();
      })
  })

  it('should find finished fixtures with pending predictions', (done) => {
    fixtureRepo.findBySeasonAndTeamsAndUpsert$(afd_manuVmanc)
      .flatMap(_ => {
        return fixtureRepo.findAllFinishedWithPendingPredictions$(season.id);
      })
      .subscribe(fs => {
        expect(fs).to.have.length(1);
        done();
      })
  })

  it('should find selectable fixtures for game round', (done) => {
    manuVmanc.seasonId = season.id;
    manuVmanc.homeTeamId = team1.id;
    manuVmanc.awayTeamId = team2.id;
    
    ligiFixtureRepo.save$(manuVmanc)
      .flatMap(_ => {
        return fixtureRepo.findSelectableFixtures$(season.id, season.currentGameRound)
      })
      .subscribe(fs => {
        expect(fs).to.have.length(1);
        done();
      })
  })
})
