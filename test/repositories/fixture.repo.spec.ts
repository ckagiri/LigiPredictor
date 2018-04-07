import { Observable } from 'rxjs'
import { expect } from 'chai';

import { LeagueRepository } from '../../src/db/repositories/league.repo';
import { SeasonRepository } from '../../src/db/repositories/season.repo';
import { TeamRepository } from '../../src/db/repositories/team.repo';
import { FixtureRepository } from '../../src/db/repositories/fixture.repo';
import * as db from '../../src/db/index';
import { config } from '../../src/config/environment/index'
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
  matchRound: 4,
  gameRound: 4,
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
  matchday: 4,
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
let leagueRepo = LeagueRepository.getInstance(ApiProvider.API_FOOTBALL_DATA);
let seasonRepo = SeasonRepository.getInstance(ApiProvider.API_FOOTBALL_DATA)
let teamRepo = TeamRepository.getInstance(ApiProvider.API_FOOTBALL_DATA)
let fixtureRepo = FixtureRepository.getInstance(ApiProvider.API_FOOTBALL_DATA)
let ligiFixtureRepo = FixtureRepository.getInstance(ApiProvider.LIGI)
let league: any, season: any, team1: any, team2: any, fixture: any;

describe('FixtureRepo', function() {
  this.timeout(5000);
  before((done) => {
    db.init(config.mongo.uri, done, { drop: true });
  })
  beforeEach(() => {
    league = season = team1 = team2 = fixture = null;
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
    Observable.zip(
      leagueRepo.insert$(epl),
      teamRepo.insert$(manu),
      teamRepo.insert$(manc))
      .flatMap((arr: any[]) => {
        league = arr[0];
        team1 = arr[1];
        team2 = arr[2];
        epl17['league'] = { id: league._id, name: league.name, slug: league.slug }
        epl17['externalReference'] = { [ApiProvider.API_FOOTBALL_DATA]: { id: afdEpl17.id } }
        return seasonRepo.insert$(epl17)
          .map(s => {
            season = s;
          })
      })
      .flatMap(_ => {
        manuVmanc.seasonId = season._id;
        manuVmanc.homeTeamId = team1._id;
        manuVmanc.awayTeamId = team2._id;
        return ligiFixtureRepo.save$(manuVmanc)
          .map(f => {
            fixture = f;
          })
      })
      .subscribe(_ => {
        expect(fixture.season).to.deep.equal(season._id)
        expect(fixture.slug).to.equal(`${team1.slug}-${team2.slug}`)
        done();
      })
  })
  it('should findEach By SeasonAndSlug AndUpdateOrCreate', (done) => {
    Observable.zip(
      leagueRepo.insert$(epl),
      teamRepo.insert$(manu),
      teamRepo.insert$(manc))
      .flatMap((arr: any[]) => {
        league = arr[0];
        team1 = arr[1];
        team2 = arr[2];
        epl17['league'] = { id: league._id, name: league.name, slug: league.slug }
        epl17['externalReference'] = { [ApiProvider.API_FOOTBALL_DATA]: { id: afdEpl17.id } }
        return seasonRepo.insert$(epl17);
      })
      .flatMap(_ => {
        return seasonRepo.findByExternalIdAndUpdate$(afdEpl17)
          .map(s => {
            season = s;
          })
      })
      .flatMap(_ => {
        return fixtureRepo.findBySeasonAndSlugAndUpdate$(afd_manuVmanc)
          .map(f => {
            fixture = f;
          })
      })
      .subscribe(_ => {
        expect(fixture.season).to.deep.equal(season._id)
        expect(fixture.slug).to.equal(`${team1.slug}-${team2.slug}`)
        done();
      })

  })
})
