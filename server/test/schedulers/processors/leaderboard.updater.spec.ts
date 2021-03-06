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
import { BoardStatus } from '../../../src/db/models/leaderboard.model';
import { CacheService } from '../../../src/common/cacheService';

let seasonId = '4edd40c86762e0fb12000001';
let gameRound = 2;
let newFixture = (id, homeTeam, awayTeam, status = FixtureStatus.FINISHED) => { 
  return {
    id: ObjectId().toHexString(),
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
    id: ObjectId().toHexString(), user: userId, fixture, status, choice: { goalsHomeTeam: 1, goalsAwayTeam: 1 }, hasJoker: false,
    points: { points: 0, pointsFor: 0, pointsAgainst: 0, MatchOutcomePoints: 0, GoalDifferencePoints: 0, TeamScorePoints: 0 }
  }
}
let finishedFixtures = [ ars_che, liv_sou, eve_wat ];
let leaderboardRepoStub:any = {
  findSeasonBoardAndUpsert$: sinon.stub(),
  findMonthBoardAndUpsert$: sinon.stub(),
  findRoundBoardAndUpsert$: sinon.stub(),
  findAll$: sinon.stub(),
  findByIdAndUpdate$: sinon.stub()
}
let chalo = {
  id: ObjectId().toHexString(),
  userName: 'chalo'
};
let kagiri = {
  id: ObjectId().toHexString(),
  userName: 'kagiri'
}
let pred1 = newPrediction(chalo.id, ars_che);
let lb1 = { id: ObjectId().toHexString() };
let lb2 = { id: ObjectId(). toHexString() };
let standing1 = {
  id: ObjectId().toHexString(),
  leaderboard: lb1.id,
  user: kagiri.id,
  points: 20,
  positionOld: 1,
  positionNew: 1
};
let standing2 = {
  id: ObjectId().toHexString(),
  leaderboard: lb1.id,
  user: chalo.id,
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
  findOneAndUpsert$: () => { return Observable.of({ id: ObjectId().toHexString() }) },
  findByLeaderboardOrderByPoints$: () => { return Observable.of([standing2, standing1]) },
  findByIdAndUpdate$: () => { return Observable.of(standing1) }
}
let leaderboardUpdater = new LeaderboardUpdater(userRepoStub, leaderboardRepoStub, predictionRepoStub, userScoreRepoStub);

describe('Leaderboard Updater', () => {
  describe('updateScores', () => {
    beforeEach(() => {
      leaderboardRepoStub.findSeasonBoardAndUpsert$.returns(Observable.of({ id: 1 }))
      leaderboardRepoStub.findMonthBoardAndUpsert$.returns(Observable.of({ id: 2 }))
      leaderboardRepoStub.findRoundBoardAndUpsert$.returns(Observable.of({ id: 3 }))
      leaderboardRepoStub.findAll$.returns(Observable.of([lb1]))
      leaderboardRepoStub.findByIdAndUpdate$.returns(Observable.of(lb1))
    })
    afterEach(() => {
      leaderboardRepoStub.findSeasonBoardAndUpsert$ = sinon.stub()
      leaderboardRepoStub.findMonthBoardAndUpsert$ = sinon.stub()
      leaderboardRepoStub.findRoundBoardAndUpsert$ = sinon.stub()
    })

    it('should getUsers', async () => {
      let spy = sinon.spy(userRepoStub, 'findAll$')
      
      await leaderboardUpdater.updateScores(finishedFixtures)
      
      expect(spy).to.have.been.calledTwice;    
    })

    it('should get Seasonboard and set status to UPDATING_SCORES ', async () => {
      let spy = leaderboardRepoStub.findSeasonBoardAndUpsert$;

      await leaderboardUpdater.updateScores(finishedFixtures)

      expect(spy).to.have.been.called;
      expect(spy).to.have.been.calledWith(seasonId, {status: BoardStatus.UPDATING_SCORES})
    })

    it('should get Monthboard and set status to UPDATING_SCORES ', async () => {
      let spy = leaderboardRepoStub.findMonthBoardAndUpsert$;

      await leaderboardUpdater.updateScores(finishedFixtures)

      expect(spy).to.have.been.called;
      let month = ars_che.date.getUTCMonth() + 1;
      let year = ars_che.date.getFullYear();
      expect(spy.firstCall).to.have.been.calledWith(seasonId, year, month, {status: BoardStatus.UPDATING_SCORES})
    })

    it('should get Roundboard and set status to UPDATING_SCORES ', async () => {
      let spy = leaderboardRepoStub.findRoundBoardAndUpsert$;

      await leaderboardUpdater.updateScores(finishedFixtures)

      expect(spy).to.have.been.called;
      expect(spy).to.have.been.calledWith(seasonId, gameRound, {status: BoardStatus.UPDATING_SCORES})
    })
    it('should get fixture prediction for the user', async () => {
      let spy = sinon.spy(predictionRepoStub, 'findOne$');

      await leaderboardUpdater.updateScores(finishedFixtures)

      expect(spy).to.have.been.called;     
      expect(spy).to.have.been.calledWith(sinon.match({ userId: chalo.id, fixtureId: ars_che.id }));
    })
    it('should cache boards', async () => {
      let spy = leaderboardRepoStub.findSeasonBoardAndUpsert$;
      leaderboardUpdater.setCacheService(new CacheService);
      await leaderboardUpdater.updateScores(finishedFixtures)
      
      expect(spy).to.have.callCount(4);      
    })
    it('should save userScores', async () => {
      let spy = sinon.spy(userScoreRepoStub, 'findOneAndUpsert$');

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
      expect(spy).to.have.been.calledWith(sinon.match.string, sinon.match({ status: BoardStatus.UPDATING_RANKINGS }))
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

  describe('SetLeaderboardsToRefreshed', () => {
    it('should get leaderboards that have UPDATING_RANKINGS status', async () => {
      let spy = leaderboardRepoStub.findAll$;

      await leaderboardUpdater.markLeaderboardsAsRefreshed(seasonId);

      expect(spy).to.have.been.called;
    })

    it('should change leaderboard status to REFRESHED', async () => {
      let spy = leaderboardRepoStub.findByIdAndUpdate$;

      let count = await leaderboardUpdater.markLeaderboardsAsRefreshed(seasonId);

      expect(spy).to.have.been.called;
      expect(spy).to.have.been.calledWith(sinon.match.string, sinon.match({ status: BoardStatus.UPDATING_RANKINGS }))
    })
  })
})

