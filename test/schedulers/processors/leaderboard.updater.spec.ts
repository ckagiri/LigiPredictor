import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;

import { FootballApiProvider as ApiProvider } from '../../../src/common/footballApiProvider'
import { ILeaderboardUpdater, LeaderboardUpdater } from '../../../src/app/schedulers/leaderboard.updater';
import { FixtureStatus } from '../../../src/db/models/fixture.model';

let newFixture = (id, homeTeam, awayTeam, status = FixtureStatus.FINISHED) => { 
  return {
    _id: ObjectId().toHexString(),
    season: '4edd40c86762e0fb12000001',
    gameRound: 2,
    homeTeam, awayTeam, status, 
    result: { goalsHomeTeam: 2, goalsAwayTeam: 1 },
    externalReference: {
      [ApiProvider.API_FOOTBALL_DATA]: { id }
    }
  }
}
let ars_che = newFixture(1, 'Arsenal', 'Chelsea'); 
let liv_sou = newFixture(2, 'Liverpool', 'Southampton');
let finishedFixtures = [ ars_che, liv_sou ];
let leaderboardRepoStub = {
  findSeasonAndUpdate$: sinon.stub()
}
let leaderboardUpdater = new LeaderboardUpdater();

describe('Leaderboard Updater', () => {
  describe('updateScores', () => {
    it('should getUsers', () => {

    })
    xdescribe('getLeaderBoards', () => {
      it('should getSeasonboard', async () => {
        let spy = leaderboardRepoStub.findSeasonAndUpdate$;

        await leaderboardUpdater.updateScores(finishedFixtures)

        expect(spy).to.have.been.called;
      })

      xit('should have seasonBoard with UpdatingScores status', () => {
      })
      
      xit('should getMonthboard', () => {
      })

      xit('should have monthBoard with UpdatingScores status', () => {          
      })
    
      xit('should getRoundboard', () => {
      })

      xit('should have roundBoard with UpdatingScores status', () => {          
      })
    
      it('should cache boards', () => {
      })
    })
    xit('should save userScores', () => {
    })
  })
  xdescribe('UpdateRankings', () => {
  })
})

