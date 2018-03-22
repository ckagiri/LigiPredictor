import * as mockery from 'mockery';
import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;

import { MainJob } from '../../../src/import/apiFootballData/main.job';
import { CompetitionJob } from '../../../src/import/apiFootballData/competition.job';
let competitions = require('../../fixtures/requests/apiFootballData.competitions2017');
let response = {
  body: JSON.stringify(competitions),
  headers: {         
    'x-requests-available': '49',
    'x-requestcounter-reset': '60'
  }
}
let requestStub = sinon.stub().returns(Promise.resolve(response));
mockery.registerMock('request-promise', requestStub);
let queueStub: any = {
  addJob: (job: any) => {}
}
let clientStub: any;

describe('ApiFootballData:Main Job', () => {
  before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })
  })
  beforeEach(() => {
    let ApiFootballDataClient = require('../../../src/thirdParty/footballApi/apiFootballData/apiClient');
    clientStub = ApiFootballDataClient.getInstance();  
  })
  after(() => {
    mockery.disable();
  });
  describe('start', () => {  
    it('should call client.getCompetitions', async () => {
      let spy = sinon.spy(clientStub, 'getCompetitions');

      let mainJob = new MainJob(clientStub)     
      await mainJob.start(queueStub)   

      expect(spy).to.be.called;
    })

    it('should call client.getCompetitions with a given year', async () => {
      let spy = sinon.spy(clientStub, 'getCompetitions');     

      let mainJob = new MainJob(clientStub)     
      await mainJob.start(queueStub)   

      expect(spy).to.have.been.calledWith(2017);
    })

    describe('with given year', () => {

      it('should add CompetitionJobs to queue', async () => {
        let spy = sinon.spy(queueStub, 'addJob');

        let mainJob = new MainJob(clientStub);      
        await mainJob.start(queueStub) 

        expect(spy).to.have.been.called;
        expect(spy).to.have.been.calledWith(sinon.match.instanceOf(CompetitionJob))
      })
    })
  })
})