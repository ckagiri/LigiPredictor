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
import { PredictionStatus } from '../../../src/db/models/prediction.model';
import { IFinishedFixturesProcessor, FinishedFixturesProcessor } from '../../../src/app/schedulers/finishedFixtures.processor';

let newFixture = (id, homeTeam, awayTeam, status = FixtureStatus.FINISHED) => { 
  return {
    _id: ObjectId().toHexString(),
    season: '4edd40c86762e0fb12000001',
    gameRound: 2,
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
let bou_wat = newFixture(4, 'Bournemouth', 'Watford');
bou_wat.allPredictionsProcessed = true;
let finishedFixtures = [ ars_che, liv_sou, eve_wat, bou_wat ];
let chalo = ObjectId().toHexString();
let kag = ObjectId().toHexString();
let newPrediction = (userId, fixture, status = PredictionStatus.PENDING) => {
  return {
    user: userId, fixture, status,  choice: { goalsHomeTeam: 1, goalsAwayTeam: 1 }
  }
}
let pred1 = newPrediction(chalo, ars_che);
let pred2 = newPrediction(kag, ars_che, PredictionStatus.PROCESSED);
let pred3 = newPrediction(chalo, liv_sou);
let pred4 = newPrediction(kag, liv_sou);

let predictionProcessorStub:any = {
  getPredictions$: sinon.stub(),
  processPrediction$: sinon.stub()
}
let finishedFixturesProcessor: IFinishedFixturesProcessor;

describe.only('Finished Fixtures', () => {
  describe('processPredictions', () => {
    beforeEach(() => {     
      predictionProcessorStub.getPredictions$.withArgs(sinon.match(ars_che)).returns(Observable.of([ pred1, pred2 ])); 
      predictionProcessorStub.getPredictions$.withArgs(sinon.match(liv_sou)).returns(Observable.of([ pred3, pred4 ])); 
      
      predictionProcessorStub.processPrediction$.returns(Observable.of(pred1));       
      finishedFixturesProcessor = new FinishedFixturesProcessor(predictionProcessorStub);
    })
    afterEach(() => {
      predictionProcessorStub.getPredictions$ = sinon.stub();
      predictionProcessorStub.processPrediction$ = sinon.stub();        
    })
    it('should getPredictions for FINISHED fixture with not AllPredictionsProcessed status', async () => {
      let spy = predictionProcessorStub.getPredictions$;

      await finishedFixturesProcessor.processPredictions(finishedFixtures)

      expect(spy).to.have.been.calledTwice;
    })

    it('should process PENDING predictions', async () => {
      let spy = predictionProcessorStub.processPrediction$;

      await finishedFixturesProcessor.processPredictions(finishedFixtures);

      expect(spy).to.have.callCount(3);
    })
  })
  
  describe('setToTrueAllPredictionsProcessed', () => {
    
  })      
})
