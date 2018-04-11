import { Observable } from 'rxjs'
import { expect } from 'chai';

import { UserModel as User } from '../../src/db/models/user.model';
import { LeagueModel as League } from '../../src/db/models/league.model';
import { SeasonModel as Season } from '../../src/db/models/season.model';
import { TeamModel as Team } from '../../src/db/models/team.model';
import { FixtureModel as Fixture, FixtureStatus } from '../../src/db/models/fixture.model';
import { PredictionModel as Prediction } from '../../src/db/models/prediction.model';
import * as db from '../../src/db/index';
import { config } from '../../src/config/environment/index'
import { ScorePoints, Score } from '../../src/common/score'
import u from './utils';
import { FinishedFixturesProcessor } from '../../src/app/schedulers/finishedFixtures.processor';

let user1: any, user2: any, league: any, season: any, team1: any, team2: any, team3: any, team4: any, 
fixture1: any, fixture2: any, user1Pred1: any, user1Pred2: any, user2Pred1: any, user2Pred2: any, sBoard: any, rBoard: any;

let finishedFixturesProcessor = FinishedFixturesProcessor.getInstance();

describe('Finished Fixtures Processor', function () {
  this.timeout(5000);
  before(done => {
    db.init(config.testDb.uri, done, { drop: true });
  })
  beforeEach(done => {    
    User.create([u.chalo, u.kagiri])
    .then(users => { 
      user1 = users[0]; user2 = users[1];
      return League.create(u.epl)
    })
    .then(l => {
      league = l;
      let { name, slug, id } = l;
      u.epl17.league = { name, slug, id };
      return Season.create(u.epl17);
    })
    .then(s => {
      season = s;
      return Team.create([u.manu, u.manc, u.che, u.ars])
    })
    .then(teams => {
      team1 = teams[0]; team2 = teams[1]; 
      team3 = teams[2]; team4 = teams[3];
      u.manuVmanc.season = season._id;
      u.manuVmanc.homeTeam = {
        name: team1.name,
        slug: team1.slug,
        id: team1._id
      };
      u.manuVmanc.awayTeam = {
        name: team2.name,
        slug: team2.slug,
        id: team2._id
      };
      u.manuVmanc.slug = `${team1.slug}-${team2.slug}`;      
      u.cheVars.season = season._id;      
      u.cheVars.homeTeam = {
        name: team3.name,
        slug: team3.slug,
        id: team3._id
      };
      u.cheVars.awayTeam = {
        name: team4.name,
        slug: team4.slug,
        id: team4._id
      };
      u.cheVars.slug = `${team3.slug}-${team4.slug}`;      
      return Fixture.create([u.manuVmanc, u.cheVars])
    })
    .then(fixtures => {
      fixture1 = fixtures[0]; fixture2 = fixtures[1];    
      let pred1 = { 
        user: user1.id, fixture: fixture1.id, fixtureSlug: fixture1.slug, season: season.id, gameRound: fixture1.gameRound, 
        choice: { goalsHomeTeam: 2, goalsAwayTeam: 0, isComputerGenerated: true }
      }
      let pred2 = { 
        user: user1.id, fixture: fixture2.id, fixtureSlug: fixture2.slug, season: season.id, gameRound: fixture2.gameRound, 
        choice: { goalsHomeTeam: 1, goalsAwayTeam: 0, isComputerGenerated: true }
      }
      let pred3 = {
        user: user2.id, fixture: fixture1.id, fixtureSlug: fixture1.slug, season: season.id, gameRound: fixture1.gameRound, 
        choice: { goalsHomeTeam: 1, goalsAwayTeam: 1, isComputerGenerated: true }
      }
      let pred4 = {
        user: user2.id, fixture: fixture2.id, fixtureSlug: fixture2.slug, season: season.id, gameRound: fixture2.gameRound, 
        choice: { goalsHomeTeam: 3, goalsAwayTeam: 0, isComputerGenerated: true }
      }

      return Prediction.create([pred1, pred2, pred3, pred4])
    })
    .then(predictions => {
      user1Pred1 = predictions[0]; user1Pred2 = predictions[1]; 
      user2Pred1 = predictions[2]; user2Pred2 = predictions[3];
      done();
    })
  })
  afterEach(done => { 
    db.drop().then(() => { done(); })
  })
  after(done => {
    db.close().then(() => { done(); })
  })
  it('should process predictions', async () => {
    fixture1.status = FixtureStatus.FINISHED;
    fixture1.result = {
      goalsHomeTeam: 2, goalsAwayTeam: 1, 
    }
    fixture2.status = FixtureStatus.FINISHED;
    fixture2.result = {
      goalsHomeTeam: 3, goalsAwayTeam: 0, 
    }
    let c = await finishedFixturesProcessor.processPredictions([fixture1, fixture2])
    expect(c).to.equal(4);

    Prediction.find({}).exec().then(ps => {
      // console.log(ps)
      expect(ps.length).to.equal(4);
    })
  })

  it('should process predictions', async () => {
    fixture1.status = FixtureStatus.FINISHED;
    fixture1.result = {
      goalsHomeTeam: 2, goalsAwayTeam: 1, 
    }
    fixture2.status = FixtureStatus.FINISHED;
    fixture2.result = {
      goalsHomeTeam: 3, goalsAwayTeam: 0, 
    }
    let c = await finishedFixturesProcessor.processPredictions([fixture1, fixture2])
    expect(c).to.equal(4);

    Prediction.find({}).exec().then(ps => {
      expect(ps.length).to.equal(4);
    })
  })

  it('should set to true allPredictionProcessed', async () => {    
    let c = await finishedFixturesProcessor.setToTrueAllPredictionsProcessed([fixture1, fixture2])

    Fixture.find({}).exec().then(fs => {
    })
  })
})