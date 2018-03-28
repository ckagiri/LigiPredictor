import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';

import { FixturesScheduler } from '../../src/app/schedulers/footballApi/fixtures.scheduler';

let taskRunnerStub:any = {
  run: async ({whenToExecute, task = () => {}, context}: any) => {
    await task.call(context)
  }
}
let newFixture = (homeTeam, awayTeam, status = 'FINISHED') => { return {homeTeam, awayTeam, status}}
let ars_che_td = newFixture('Arsenal', 'Chelsea'); 
let liv_sou_td = newFixture('Liverpool', 'Southampton');
let eve_bur_yd = newFixture('Everton', 'Burnley');
let bou_wat_tm = newFixture('Bournemouth', 'Watford');
let apiClientStub:any = {
  getTomorrowsFixtures: () => {  return Promise.resolve({ data: {fixtures: [bou_wat_tm]} }) },
  getYesterdaysFixtures: () => { return Promise.resolve({ data: {fixtures: [eve_bur_yd]} }) },
  getTodaysFixtures: () => { return Promise.resolve({ data: {fixtures: [ars_che_td, liv_sou_td]} }) },
}
let fixtureConverterStub:any = {
  map: (data: any[]) => { return data }
}
let fixturesUpdaterStub:any = {
  updateGameDetails: (fixtures: any[]) => { return Promise.resolve(fixtures) }
}
let eventMediatorStub:any = {
  publish(event: string, ...args:any[]) { }
}
let fixturesScheduler: any;
describe('ApiFootballData: Fixtures scheduler', () => {
  beforeEach(() => {
    fixturesScheduler = new FixturesScheduler(taskRunnerStub, apiClientStub, fixtureConverterStub, fixturesUpdaterStub, eventMediatorStub);    
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
    let taskExecutionCount = 0;
    fixturesScheduler.start();  
    fixturesScheduler.on('task:executed', () => {
      taskExecutionCount += 1;
      if(taskExecutionCount == 2) {
        fixturesScheduler.stop();
      }
    });
    fixturesScheduler.on('stopped', () => {
      expect(taskExecutionCount).to.equal(2);
      done();
    });
    clock.restore();  
  })

  it('should call publish process:predictions', (done) => {
    let clock = sinon.useFakeTimers();
    let spy = sinon.spy(eventMediatorStub, 'publish');      
    fixturesScheduler.start();  
    fixturesScheduler.on('task:executed', () => {
      fixturesScheduler.stop();
    });
    fixturesScheduler.on('stopped', () => {
      expect(spy).to.have.been.called;
      done();
    });
    //todo: tohave been called with first arg, second arg
    clock.restore();  
  })  
})