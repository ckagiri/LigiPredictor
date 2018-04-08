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
    result: { goalsHomeTeam: 2, goalsAwayTeam: 1 },
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
let chaloJoker = { user: chalo._id, fixture: liv_sou._id };
let kagiriJoker = { user: kagiri._id, fixture: ars_che._id }
let chaloPred = { user: chalo._id, fixture: ars_che._id, 
  choice: { goalsHomeTeam: 1, goalsAwayTeam: 1 }
}
let predictionRepoStub: any = {
  getOrCreateJoker$: sinon.stub(),
  findByUserAndFixture$: sinon.stub(),
  findByIdAndUpdate$: sinon.stub()
}
let predictionCalculatorStub: any = {
  calculateScore: () => { return { points: 9 } } 
}
let predictionProcessor: IPredictionProcessor;
describe('Prediction Processor', () => {
  describe('getPredictions$', async () => {
    beforeEach(() => {
      predictionRepoStub.getOrCreateJoker$.withArgs(sinon.match(chalo._id)).returns(Observable.of(chaloJoker));
      predictionRepoStub.getOrCreateJoker$.withArgs(sinon.match(kagiri._id)).returns(Observable.of(kagiriJoker));   
      predictionRepoStub.findByUserAndFixture$.returns(Observable.of(chaloPred)); 
      predictionProcessor = new PredictionProcessor(fixtureRepoStub, userRepoStub, predictionRepoStub, predictionCalculatorStub);     
    })

    afterEach(() => {
      predictionRepoStub.getOrCreateJoker$ = sinon.stub();
      predictionRepoStub.findByUserAndFixture$ = sinon.stub();
    })  

    it('should get the selectable fixtures of gameRound', async () => {
      let spy = sinon.spy(fixtureRepoStub, 'findSelectableFixtures$');

      await predictionProcessor.getPredictions$(ars_che).toPromise();

      expect(spy).to.have.been.calledOnce;
    })

    it('should get all users', async () => {
      let spy = sinon.spy(userRepoStub, 'findAll$')

      await predictionProcessor.getPredictions$(ars_che).toPromise();

      expect(spy).to.have.been.calledOnce;
    })

    it('should getOrCreate jokerPrediction for user', async () => {
      let spy = predictionRepoStub.getOrCreateJoker$

      await predictionProcessor.getPredictions$(ars_che).toPromise();

      expect(spy).to.have.been.calledTwice;
      expect(spy.firstCall).to.have.been.calledWithExactly(
        chalo._id, ars_che.season, ars_che.gameRound,
        [ liv_sou._id, ars_che._id ])
      expect(spy.secondCall).to.have.been.calledWithExactly(
        kagiri._id, ars_che.season, ars_che.gameRound,
        [ liv_sou._id, ars_che._id ])
    })

    it('should getOrCreate prediction if joker fixure != fixture passed', async () => {
      let spy = predictionRepoStub.findByUserAndFixture$;
      
      await predictionProcessor.getPredictions$(ars_che).toPromise();

      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWithExactly(chalo._id, ars_che._id)
    })

    it('should not getOrCreate prediction if joker fixture == passedIn fixture', async () => {
      let spy = predictionRepoStub.findByUserAndFixture$;

      await predictionProcessor.getPredictions$(liv_sou).toPromise();

      expect(spy).to.have.been.calledOnce; 
    })

    it('should return equal number of predictions to users', async () => {
      let predictions = await predictionProcessor.getPredictions$(ars_che).toPromise();

      expect(predictions).to.be.an('array');
      expect(predictions.length).to.equal(2);
    })
  })
  
  describe('processPrediction', () => {
    beforeEach(() => {
      predictionRepoStub.findByIdAndUpdate$.returns(Observable.of(chaloPred)); 
      predictionProcessor = new PredictionProcessor(fixtureRepoStub, userRepoStub, predictionRepoStub, predictionCalculatorStub);
      
    })
    afterEach(() => {
      predictionRepoStub.findByIdAndUpdate$ = sinon.stub()      
    })
    
    it('should calculate score for prediction', (done) => {
      let spy = sinon.spy(predictionCalculatorStub, 'calculateScore');

      predictionProcessor.processPrediction$(chaloPred, ars_che)
        .subscribe(_ => {
          expect(spy).to.have.been.calledOnce;
          expect(spy).to.have.been.calledWith(
            { goalsHomeTeam: 1, goalsAwayTeam: 1 }, { goalsHomeTeam: 2, goalsAwayTeam: 1 })  
          done();
        });
    })

    it('should save calculatedScore for prediction', (done) => {
      let spy = predictionRepoStub.findByIdAndUpdate$;

      predictionProcessor.processPrediction$(chaloPred, ars_che)
        .subscribe(_ => {
          expect(spy).to.have.been.called;
          expect(spy).to.have.been.calledWithMatch(chaloPred['_id'])
          done();
        })      
    })
  })
})