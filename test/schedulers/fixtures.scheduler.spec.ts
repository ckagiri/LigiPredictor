import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';

import { FixturesScheduler } from '../../src/app/schedulers/footballApi/fixtures.scheduler';
import { FixtureStatus } from '../../src/db/models/fixture.model';
let taskRunnerStub:any = {
  run: async ({whenToExecute, task = () => {}, context}: any) => {
    await task.call(context)
  }
}
let newFixture = (homeTeam, awayTeam, status = FixtureStatus.FINISHED) => { return {homeTeam, awayTeam, status}}
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
let fixturesScheduler: FixturesScheduler;
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

  describe.only('nextUpdate', () => {
    it('should update after 90secs if any fixture is IN_PLAY', (done) => {
      ars_che_td.status = FixtureStatus.IN_PLAY;
      fixturesScheduler.start();  
      fixturesScheduler.on('task:executed', () => {
        fixturesScheduler.stop();
      });
      fixturesScheduler.on('stopped', () => {
        expect(fixturesScheduler.NextUpdate).to.be.at.most(90*1000)
          .and.to.be.at.least(89*1000);
        done();
      });
    })  
    it('should update after 90secs if any fixture is within 5 mins to kickOff', (done) => {
      ars_che_td.status = FixtureStatus.TIMED;
      let date = new Date();
      date.setSeconds(+date.getSeconds() + 270);    
      ars_che_td['date'] = date;
      fixturesScheduler.start();  
      fixturesScheduler.on('task:executed', () => {
        fixturesScheduler.stop();
      });
      fixturesScheduler.on('stopped', () => {
        expect(fixturesScheduler.NextUpdate).to.be.at.most(90*1000)
          .and.to.be.at.least(89*1000);
        done();
      });
    })  

    it('should update after 6 hours if earliest kickOff is in 6 hours', (done) => {
      ars_che_td.status = FixtureStatus.TIMED;
      let date = new Date();
      date.setHours(+date.getHours() + 6);    
      ars_che_td['date'] = date;
      fixturesScheduler.start();  
      fixturesScheduler.on('task:executed', () => {
        fixturesScheduler.stop();
      });
      fixturesScheduler.on('stopped', () => {
        expect(fixturesScheduler.NextUpdate).to.be.at.most(6*60*60*1000)
          .and.to.be.at.least((6*60*60*1000)-10);
        done();
      });
    })  

    it('should update after 12 hours if any kickOff is in after 12 hours', (done) => {
      ars_che_td.status = FixtureStatus.TIMED;
      let date = new Date();
      date.setHours(+date.getHours() + 15);    
      ars_che_td['date'] = date;
      fixturesScheduler.start();  
      fixturesScheduler.on('task:executed', () => {
        fixturesScheduler.stop();
      });
      fixturesScheduler.on('stopped', () => {
        expect(fixturesScheduler.NextUpdate).to.be.at.most(12*60*60*1000)
        .and.to.be.at.least((12*60*60*1000)-10);
        done();
      });
    })  
  })
})