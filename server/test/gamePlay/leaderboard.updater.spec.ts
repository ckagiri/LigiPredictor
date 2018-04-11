import { Observable } from 'rxjs'
import { expect } from 'chai';

import { UserModel as User } from '../../src/db/models/user.model';
import { LeagueModel as League } from '../../src/db/models/league.model';
import { SeasonModel as Season } from '../../src/db/models/season.model';
import { TeamModel as Team } from '../../src/db/models/team.model';
import { FixtureModel as Fixture, FixtureStatus } from '../../src/db/models/fixture.model';
import { PredictionModel as Prediction } from '../../src/db/models/prediction.model';
import { LeaderboardModel as Leaderboard } from '../../src/db/models/leaderboard.model';
import { UserScoreModel as UserScore } from '../../src/db/models/userScore.model';
import * as db from '../../src/db/index';
import { config } from '../../src/config/environment/index'
import { ScorePoints, Score } from '../../src/common/score'
import u from './utils';
import { LeaderboardUpdater } from '../../src/app/schedulers/leaderboard.updater';

let user1: any, user2: any, league: any, season: any, team1: any, team2: any, team3: any, team4: any, 
fixture1: any, fixture2: any, user1Pred1: any, user1Pred2: any, user2Pred1: any, user2Pred2: any, sBoard: any, rBoard: any;

let leaderboardUpdater = LeaderboardUpdater.getInstance();

describe('Leaderboard Updater', function () {
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
      u.manuVmanc.status = FixtureStatus.FINISHED;
      u.manuVmanc.result = { goalsHomeTeam: 2, goalsAwayTeam: 1 };
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
      u.cheVars.status = FixtureStatus.FINISHED;  
      u.cheVars.result = { goalsHomeTeam: 3, goalsAwayTeam: 0 }
      return Fixture.create([u.manuVmanc, u.cheVars])
    })
    .then(fixtures => {
      fixture1 = fixtures[0]; fixture2 = fixtures[1];    
      let pred1 = { 
        user: user1.id, fixture: fixture1.id, fixtureSlug: fixture1.slug, season: season.id, gameRound: fixture1.gameRound, 
        choice: { goalsHomeTeam: 2, goalsAwayTeam: 0, isComputerGenerated: false }, hasJoker: true, 
        scorePoints: { 
          points: 6, APoints: 6, BPoints: 0, MatchOutcomePoints: 4, TeamScorePlusPoints: 2,
          GoalDifferencePoints: 0, ExactScorePoints: 0, TeamScoreMinusPoints: 0
        }
      }
      let pred2 = { 
        user: user1.id, fixture: fixture2.id, fixtureSlug: fixture2.slug, season: season.id, gameRound: fixture2.gameRound, 
        choice: { goalsHomeTeam: 1, goalsAwayTeam: 0, isComputerGenerated: false }, hasJoker: false,
        scorePoints: { 
          points: 4, APoints: 5, BPoints: -1, MatchOutcomePoints: 4, TeamScorePlusPoints: 1,
          GoalDifferencePoints: 0, ExactScorePoints: 0, TeamScoreMinusPoints: -1        
        }
      }
      let pred3 = {
        user: user2.id, fixture: fixture1.id, fixtureSlug: fixture1.slug, season: season.id, gameRound: fixture1.gameRound, 
        choice: { goalsHomeTeam: 1, goalsAwayTeam: 1, isComputerGenerated: false }, hasJoker: false,
        scorePoints: { 
          points: 1, APoints: 1, BPoints: 0, MatchOutcomePoints: 0, TeamScorePlusPoints: 1,
          GoalDifferencePoints: 0, ExactScorePoints: 0, TeamScoreMinusPoints: 0
        }
      }
      let pred4 = {
        user: user2.id, fixture: fixture2.id, fixtureSlug: fixture2.slug, season: season.id, gameRound: fixture2.gameRound, 
        choice: { goalsHomeTeam: 3, goalsAwayTeam: 0, isComputerGenerated: false }, hasJoker: true,
        scorePoints: { 
          points: 10, APoints: 8, BPoints: 2, MatchOutcomePoints: 4, TeamScorePlusPoints: 4,
          GoalDifferencePoints: 1, ExactScorePoints: 1, TeamScoreMinusPoints: 0
        }
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

  it('should update scores', async () => {
    let c = await leaderboardUpdater.updateScores([fixture1, fixture2])
    Prediction.find({}).exec().then(preds => {
      // console.log('preds', preds);
    })

    Leaderboard.find({}).exec().then(boards => {
      // console.log('boards', boards)
    })
    UserScore.find({}).exec().then(standings => {
      // console.log('standings', standings)
    })
  });

  it('should update rankings => first take', async() => {
    await leaderboardUpdater.updateScores([fixture1, fixture2])

    let c = await leaderboardUpdater.updateRankings(season.id);

    UserScore.find({}).exec().then(standings => {
     // console.log('standings', standings)
    })
  })

  it('should update rankings => second take', async () => {
    await leaderboardUpdater.updateScores([fixture1])

    await leaderboardUpdater.updateRankings(season.id);

    await leaderboardUpdater.updateScores([fixture2])
    
    await leaderboardUpdater.updateRankings(season.id);    

    UserScore.find({}).exec().then(standings => {
      // console.log('standings', standings)
    })
  })

  it('should mark leaderboards as refreshed', async () => {
    await leaderboardUpdater.updateScores([fixture1])
    await leaderboardUpdater.updateRankings(season.id);
    
    let c = await leaderboardUpdater.markLeaderboardsAsRefreshed(season.id);
    
    Leaderboard.find({}).exec().then(boards => {
      // console.log(boards)
    })
  })
})