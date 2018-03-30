import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;
import { FootballApiProvider as ApiProvider } from '../../../src/common/footballApiProvider'
import { FixtureStatus } from '../../../src/db/models/fixture.model';
import { IPredictionProcessor, PredictionProcessor } from '../../../src/app/schedulers/prediction.processor'

let newFixture = (id, homeTeam, awayTeam, status = FixtureStatus.FINISHED) => { 
  return {
    _id: ObjectId().toHexString(),
    season: '4edd40c86762e0fb12000001',
    gameRound: 2,
    homeTeam, awayTeam, status, 
    externalReference: {
      [ApiProvider.API_FOOTBALL_DATA]: { id }
    }
  }
}
let chalo = {
  _id: ObjectId().toHexString(),
  userName: 'chalo'
};
let kagiri = {
  _id: ObjectId().toHexString(),
  userName: 'kagiri'
}
let ars_che = newFixture(1, 'Arsenal', 'Chelsea'); 
let liv_sou = newFixture(2, 'Liverpool', 'Southampton');
let fixtureRepoStub:any = {
  findSelectableFixtures$: () => { return Observable.of([liv_sou])}
}
let userRepoStub: any = {
  findAll$: () => { return Observable.of([chalo, kagiri]) }
}
let predictionRepoStub: any = {
  getOrCreateJoker$: () => { return Observable.of() }
}

let predictionProcessor: IPredictionProcessor;
describe.only('Prediction Processor', () => {
  beforeEach(() => {
    predictionProcessor = new PredictionProcessor(fixtureRepoStub, userRepoStub, predictionRepoStub);
  })
  describe('getPredictions', async () => {
    it('should get the selectable fixtures of gameRound', async () => {
      let spy = sinon.spy(fixtureRepoStub, 'findSelectableFixtures$');

      await predictionProcessor.getPredictions(ars_che)

      expect(spy).to.have.been.called;
    })
    it('should get all users', async () => {
      let spy = sinon.spy(userRepoStub, 'findAll$')

      await predictionProcessor.getPredictions(ars_che);

      expect(spy).to.have.been.called;
    })
    it('should getOrCreate joker prediction for user', async () => {
      let spy = sinon.spy(predictionRepoStub, 'getOrCreateJoker$')

      await predictionProcessor.getPredictions(ars_che);

      expect(spy).to.have.been.calledTwice;
      expect(spy.firstCall).have.been.calledWithExactly(
        chalo._id, ars_che.season, ars_che.gameRound,
        [ liv_sou._id, ars_che._id ])
      expect(spy.secondCall).calledWithExactly(
        kagiri._id, ars_che.season, ars_che.gameRound,
        [ liv_sou._id, ars_che._id ])
    })
    xit('should getOrCreate prediction if joker fixure != fixture passed', () => {

    })
    xit('should not getOrCreate prediction if joker fixture == passedIn fixture', () => {

    })
  })
  
  xdescribe('processPrediction', () =>{
    it('should calculate score for prediction', () => {

    })
    it('should save calculatedScore for prediction', () => {

    })
  })
})