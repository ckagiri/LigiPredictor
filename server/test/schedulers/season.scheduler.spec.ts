import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';

import { SeasonScheduler } from '../../src/app/schedulers/footballApi/season.scheduler';

let taskRunnerStub:any = {
  run: async ({whenToExecute, task = () => {}, context}: any) => {
    await task.call(context)
  }
}
let apiClientStub:any = {
  getCompetitions: () => { return Promise.resolve() }
}
let seasonConverterStub:any = {
  map: (data) => { return data }
}
let seasonUpdaterStub:any = {
  updateCurrentMatchRound: () => { return Promise.resolve() }
}
let eventMediatorStub:any = sinon.stub();

let seasonScheduler: any;

describe('ApiFootballData: Season scheduler', () => {   
  beforeEach(() => {
    seasonScheduler = new SeasonScheduler(taskRunnerStub, apiClientStub, seasonConverterStub, seasonUpdaterStub, eventMediatorStub);
  }) 
  describe('start', () => {
    const POLLING_INTERVAL = 24 * 60 * 60 * 1000;
    
    it('should set polling true/false when started/stopped respectively', (done) => {
      seasonScheduler.start();
      expect(seasonScheduler.IsPolling).to.be.true;
      seasonScheduler.stop();
      seasonScheduler.on('stopped', () => {
        expect(seasonScheduler.IsPolling).to.be.false;
        done();
      });
    })

    it('should run again after polling interval', (done) => {
      let clock = sinon.useFakeTimers();
      let spy = sinon.spy(seasonScheduler, 'onTaskExecuted');      
      let count = 0;
      seasonScheduler.start();  
      seasonScheduler.on('task:executed', () => {
        count += 1;
        if(count == 2) {
          seasonScheduler.stop();
        }
      });
      seasonScheduler.on('stopped', () => {
        expect(spy).to.have.callCount(2);
        expect(seasonScheduler.PollingInterval).to.equal(POLLING_INTERVAL)  //24hours      
        done();
      });
      clock.restore();  
    })

    it('should getCompetitions from apiClient', (done) => {
      let clock = sinon.useFakeTimers();
      let spy = sinon.spy(apiClientStub, 'getCompetitions');      
      seasonScheduler.start();  
      seasonScheduler.on('task:executed', () => {
          seasonScheduler.stop();
      });
      seasonScheduler.on('stopped', () => {
        expect(spy).to.have.been.called;
        done();
      });
      clock.restore();  
    })

    it('should update seasons', (done) => {
      let clock = sinon.useFakeTimers();
      let spy = sinon.spy(seasonUpdaterStub, 'updateCurrentMatchRound');      
      seasonScheduler.start();  
      seasonScheduler.on('task:executed', () => {
          seasonScheduler.stop();
      });
      seasonScheduler.on('stopped', () => {
        expect(spy).to.have.been.called;
        done();
      });
      clock.restore();  
    })  
  })  
})