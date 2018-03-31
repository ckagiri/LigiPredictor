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
import { PredictionStatus } from '../../../src/db/models/prediction.model';
import { LeaderboardStatus } from '../../../src/db/models/leaderboard.model';

let seasonId = '4edd40c86762e0fb12000001';
let gameRound = 2;
let newFixture = (id, homeTeam, awayTeam, status = FixtureStatus.FINISHED) => { 
  return {
    _id: ObjectId().toHexString(),
    season: seasonId,
    gameRound,
    date: new Date(),
    homeTeam, awayTeam, status, 
    result: { goalsHomeTeam: 2, goalsAwayTeam: 1 },
    allPredictionsProcessed: false,
    externalReference: {
      [ApiProvider.API_FOOTBALL_DATA]: { id }
    }
  }
}
let ars_che = newFixture(1, 'Arsenal', 'Chelsea'); 
let liv_sou = newFixture(2, 'Liverpool', 'Southampton');
let eve_wat = newFixture(3, 'Everton', 'Watford', FixtureStatus.IN_PLAY);
let newPrediction = (userId, fixture, status = PredictionStatus.PENDING) => {
  return {
    _id: ObjectId().toHexString(), user: userId, fixture, status, choice: { goalsHomeTeam: 1, goalsAwayTeam: 1 }, hasJoker: false,
    points: { points: 0, pointsFor: 0, pointsAgainst: 0, MatchOutcomePoints: 0, GoalDifferencePoints: 0, TeamScorePoints: 0 }
  }
}
let finishedFixtures = [ ars_che, liv_sou, eve_wat ];
let leaderboardRepoStub:any = {
  findSeasonBoardAndUpdate$: sinon.stub(),
  findMonthBoardAndUpdate$: sinon.stub(),
  findRoundBoardAndUpdate$: sinon.stub(),
  findAll$: sinon.stub(),
  findByIdAndUpdate$: sinon.stub()
}
let chalo = {
  _id: ObjectId().toHexString(),
  userName: 'chalo'
};
let kagiri = {
  _id: ObjectId().toHexString(),
  userName: 'kagiri'
}
let pred1 = newPrediction(chalo._id, ars_che);
let lb1 = { _id: ObjectId().toHexString() };
let lb2 = { _id: ObjectId(). toHexString() };
let standing1 = {
  _id: ObjectId().toHexString(),
  leaderboard: lb1._id,
  user: kagiri._id,
  points: 20,
  positionOld: 1,
  positionNew: 1
};
let standing2 = {
  _id: ObjectId().toHexString(),
  leaderboard: lb1._id,
  user: chalo._id,
  points: 30,
  positionOld: 2,
  positionNew: 2
};
let userRepoStub: any = {
  findAll$: () => { return Observable.of([chalo, kagiri]) }
}
let predictionRepoStub: any = {
  findOne$: () => { return Observable.of(pred1) }
}
let userScoreRepoStub: any = {
  findOneAndUpdateOrCreate$: () => { return Observable.of({ _id: ObjectId().toHexString() }) },
  findByLeaderboardOrderByPoints$: () => { return Observable.of([standing2, standing1]) },
  findByIdAndUpdate$: () => { return Observable.of(standing1) }
}
let leaderboardUpdater = new LeaderboardUpdater(userRepoStub, leaderboardRepoStub, predictionRepoStub, userScoreRepoStub);

describe.only('Leaderboard Updater', () => {
  describe('updateScores', () => {
    beforeEach(() => {
      leaderboardRepoStub.findSeasonBoardAndUpdate$.returns(Observable.of({ _id: 1 }))
      leaderboardRepoStub.findMonthBoardAndUpdate$.returns(Observable.of({ _id: 2 }))
      leaderboardRepoStub.findRoundBoardAndUpdate$.returns(Observable.of({ _id: 3 }))
      leaderboardRepoStub.findAll$.returns(Observable.of([lb1]))
      leaderboardRepoStub.findByIdAndUpdate$.returns(Observable.of(lb1))
    })
    afterEach(() => {
      leaderboardRepoStub.findSeasonBoardAndUpdate$ = sinon.stub()
      leaderboardRepoStub.findMonthBoardAndUpdate$ = sinon.stub()
      leaderboardRepoStub.findRoundBoardAndUpdate$ = sinon.stub()
    })

    it('should getUsers', async () => {
      let spy = sinon.spy(userRepoStub, 'findAll$')
      
      await leaderboardUpdater.updateScores(finishedFixtures)
      
      expect(spy).to.have.been.calledTwice;    
    })

    it('should get Seasonboard and set status to UPDATING_SCORES ', async () => {
      let spy = leaderboardRepoStub.findSeasonBoardAndUpdate$;

      await leaderboardUpdater.updateScores(finishedFixtures)

      expect(spy).to.have.been.called;
      expect(spy).to.have.been.calledWith(seasonId, {status: LeaderboardStatus.UPDATING_SCORES})
    })

    it('should get Monthboard and set status to UPDATING_SCORES ', async () => {
      let spy = leaderboardRepoStub.findMonthBoardAndUpdate$;

      await leaderboardUpdater.updateScores(finishedFixtures)

      expect(spy).to.have.been.called;
      let month = ars_che.date.getUTCMonth() + 1;
      let year = ars_che.date.getFullYear();
      expect(spy.firstCall).to.have.been.calledWith(seasonId, year, month, {status: LeaderboardStatus.UPDATING_SCORES})
    })

    it('should get Roundboard and set status to UPDATING_SCORES ', async () => {
      let spy = leaderboardRepoStub.findRoundBoardAndUpdate$;

      await leaderboardUpdater.updateScores(finishedFixtures)

      expect(spy).to.have.been.called;
      expect(spy).to.have.been.calledWith(seasonId, gameRound, {status: LeaderboardStatus.UPDATING_SCORES})
    })
    it('should get fixture prediction for the user', async () => {
      let spy = sinon.spy(predictionRepoStub, 'findOne$');

      await leaderboardUpdater.updateScores(finishedFixtures)

      expect(spy).to.have.been.called;      
      expect(spy.firstCall).to.have.been.calledWith(chalo._id, ars_che._id)    

    })
    it('should cache boards', async () => {
      let spy = leaderboardRepoStub.findSeasonBoardAndUpdate$;
      
      await leaderboardUpdater.updateScores(finishedFixtures)
      
      expect(spy).to.have.callCount(4);      
    })
    it('should save userScores', async () => {
      let spy = sinon.spy(userScoreRepoStub, 'findOneAndUpdateOrCreate$');

      let count = await leaderboardUpdater.updateScores(finishedFixtures);

      expect(spy).to.have.been.called;
      expect(spy.getCall(0).args.length).to.equal(6)
    })
  })
  describe('UpdateRankings', () => {
    it('should get leaderboards that have UPDATING_SCORES status', async () => {
      let spy = leaderboardRepoStub.findAll$;

      await leaderboardUpdater.updateRankings(seasonId);

      expect(spy).to.have.been.called;
    })

    it('should change leaderboard status to UPDATING_RANKINGS', async () => {
      let spy = leaderboardRepoStub.findByIdAndUpdate$;

      await leaderboardUpdater.updateRankings(seasonId);

      expect(spy).to.have.been.called;
      expect(spy).to.have.been.calledWith(sinon.match.string, sinon.match({ status: LeaderboardStatus.UPDATING_RANKINGS }))
    })

    it('should get userScores from leaderboard ordered by points', async () => {
      let spy = sinon.spy(userScoreRepoStub, 'findByLeaderboardOrderByPoints$');

      await leaderboardUpdater.updateRankings(seasonId);

      expect(spy).to.have.been.called;
      userScoreRepoStub.findByLeaderboardOrderByPoints$.restore();
    })

    it('should update positions', async () => {
      let spy = sinon.spy(userScoreRepoStub, 'findByIdAndUpdate$');

      let count = await leaderboardUpdater.updateRankings(seasonId);

      expect(spy).to.have.been.called;
      expect(spy.firstCall).to.have.been.calledWith(sinon.match.string, { positionNew: 1, positionOld: 2 })
      expect(spy.secondCall).to.have.been.calledWith(sinon.match.string, { positionNew: 2, positionOld: 1 })
    })
  })
})

