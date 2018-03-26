import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';

import { FixturesScheduler } from '../../src/app/schedulers/footballApi/apiFootballData/fixtures.scheduler';

let taskRunnerStub:any = {
  run: async ({whenToExecute, task = () => {}, context}: any) => {
    await task.call(context)
  }
}
let apiClientStub:any = {
  getTomorrowsFixtures: () => { return Promise.resolve([1]) },
  getYesterdaysFixtures: () => { return Promise.resolve([2]) },
  getTodaysFixtures: () => { return Promise.resolve([3]) }
}
let fixturesUpdaterStub:any = {
  updateFixtures: (fixtures: any[]) => { return Promise.resolve(fixtures) }
}
let finishedFixturesProcessorStub: any = {
  processFixtures: (fixtures: any) => { return Promise.resolve(fixtures) }
}
let fixturesScheduler: any;
describe.only('ApiFootballData: Fixtures scheduler', () => {
  beforeEach(() => {
    fixturesScheduler = new FixturesScheduler(taskRunnerStub, apiClientStub, fixturesUpdaterStub, finishedFixturesProcessorStub);    
  })
  it('should set polling true/false when started/stopped respectively', (done) => {
    fixturesScheduler.start();
    expect(fixturesScheduler.IsPolling).to.be.true;
    fixturesScheduler.stop();
    fixturesScheduler.on('stopped', () => {
      expect(fixturesScheduler.IsPolling).to.be.false;
      done();
    });
  })

  it('should run again after polling interval', (done) => {
    let clock = sinon.useFakeTimers();
    let spy = sinon.spy(fixturesScheduler, 'onTaskExecuted');      
    let count = 0;
    fixturesScheduler.start();  
    fixturesScheduler.on('task:executed', () => {
      count += 1;
      if(count == 2) {
        fixturesScheduler.stop();
      }
    });
    fixturesScheduler.on('stopped', () => {
      expect(spy).to.have.callCount(2);
      done();
    });
    clock.restore();  
  })
})