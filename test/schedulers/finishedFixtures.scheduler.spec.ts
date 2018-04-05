import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';

import { FinishedFixturesScheduler } from '../../src/app/schedulers/finishedFixtures.scheduler';
import { FixturesScheduler } from '../../src/app/schedulers/footballApi/fixtures.scheduler';

import { IEventMediator, EventMediator } from '../../src/common/eventMediator'
let taskRunnerStub:any = {
  run: async ({whenToExecute, task = () => {}, context}: any) => {
    await task.call(context)
  }
}
let fixturesProcessorStub: any = {
  processPredictions: (fixtures: any[]) => {  
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 5)});
  }
}
let eventMediator: IEventMediator = EventMediator.getInstance();
let finishedFixturesScheduler: FinishedFixturesScheduler;

describe('ApiFootballData: FinishedFixtures scheduler', () => {
  beforeEach(() => {
    eventMediator.removeAllListeners(); 
    finishedFixturesScheduler = new FinishedFixturesScheduler(taskRunnerStub, fixturesProcessorStub, eventMediator);
  })
  it('should set polling true/false when started/stopped respectively', (done) => {
    finishedFixturesScheduler.start();
    expect(finishedFixturesScheduler.IsRunning).to.be.true;
    finishedFixturesScheduler.stop();
    finishedFixturesScheduler.on('stopped', () => {
      expect(finishedFixturesScheduler.IsRunning).to.be.false;
      done();
    });
  })
  describe('on finished fixtures updated', () => {
    let newFixture = (homeTeam, awayTeam, status = 'FINISHED') => { return {homeTeam, awayTeam, status}}
    let ars_che_td = newFixture('Arsenal', 'Chelsea'); 
    let liv_sou_td = newFixture('Liverpool', 'Southampton');
    let apiClientStub:any = {
      getTomorrowsFixtures: () => {  return Promise.resolve({ data: {fixtures: []} }) },
      getYesterdaysFixtures: () => { return Promise.resolve({ data: {fixtures: []} }) },
      getTodaysFixtures: () => { return Promise.resolve({ data: {fixtures: [ars_che_td, liv_sou_td]} }) },
    }
    let fixtureConverterStub:any = {
      map: (data: any[]) => { return data }
    }
    let fixturesUpdaterStub:any = {
      updateGameDetails: (fixtures: any[]) => { return Promise.resolve(fixtures) }
    }
    let fixturesScheduler: any;
    
    beforeEach(() => {
      fixturesScheduler = new FixturesScheduler(taskRunnerStub, apiClientStub, fixtureConverterStub, fixturesUpdaterStub, eventMediator);    
    })

    it('should processPredictions', (done) => {
      let clock = sinon.useFakeTimers();
      let spy = sinon.spy(fixturesProcessorStub, 'processPredictions');   
      fixturesScheduler.start(); 
      finishedFixturesScheduler.start();       
      fixturesScheduler.on('task:executed', () => {
        fixturesScheduler.stop();
      });
      finishedFixturesScheduler.on('task:executed', () => {
        finishedFixturesScheduler.stop();
      })
      eventMediator.addListener('predictions:processed', () => {
        expect(spy).to.have.been.called;   
        done();  
      })
      clock.restore();  
    })  
  })
})