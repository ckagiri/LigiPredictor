import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;

import { MainJob } from '../../../src/import/apiFootballData/main.job';
import { CompetitionJob } from '../../../src/import/apiFootballData/competition.job';

let competitions = require('../../fixtures/requests/apiFootballData.competitions2017');
let queueStub: any = {
  addJob: (job: any) => {}
}
let clientStub: any = {
  getCompetitions: () => {
    return Promise.resolve({
      data: competitions,
      metadata: { }
    })
  }
}  
let seasonRepoStub:any = sinon.stub();
let teamRepoStub:any = sinon.stub();
let fixtureRepoStub:any = sinon.stub();

describe('ApiFootballData:Main Job', () => {
  describe('start', () => {  
    it('should call client.getCompetitions', async () => {
      let spy = sinon.spy(clientStub, 'getCompetitions');

      let mainJob = new MainJob(clientStub, seasonRepoStub, teamRepoStub, fixtureRepoStub)     
      await mainJob.start(queueStub)   

      expect(spy).to.be.called;
      clientStub.getCompetitions.restore();
    })

    it('should call client.getCompetitions with a given year', async () => {
      let spy = sinon.spy(clientStub, 'getCompetitions');     

      let mainJob = new MainJob(clientStub, seasonRepoStub, teamRepoStub, fixtureRepoStub)     
      await mainJob.start(queueStub)   

      expect(spy).to.have.been.calledWith(2017);
    })

    describe('with given year', () => {

      it('should add CompetitionJobs to queue', async () => {
        let spy = sinon.spy(queueStub, 'addJob');

        let mainJob = new MainJob(clientStub, seasonRepoStub, teamRepoStub, fixtureRepoStub)     
        await mainJob.start(queueStub) 

        expect(spy).to.have.been.called;
        expect(spy).to.have.been.calledWith(sinon.match.instanceOf(CompetitionJob))
      })
    })
  })
})