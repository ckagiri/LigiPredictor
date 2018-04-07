import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';
import { FixturesJob } from '../../../src/import/apiFootballData/fixtures.job';

let fixtures = require('../../fixtures/requests/apiFootballData.epl2017Fixtures');
let clientStub: any = {
  getFixtures: () => {
    return Promise.resolve({
      data: fixtures
    })
  }
}
let fixtureRepoStub: any = {
  findEachBySeasonAndSlugAndUpdate$: () => {
    return Observable.of(fixtures.fixtures)
  }
}
let competitionId = 445;
let jobBuilder = FixturesJob.Builder;
let job = jobBuilder
  .setApiClient(clientStub)
  .setFixtureRepo(fixtureRepoStub)
  .withCompetition(competitionId)
  .build()
let queueStub:any = sinon.stub();

describe('ApiFootballData:Fixtures Job', () => {    
  describe('start', () => {
    it('should call client.getFixtures', async () => {
      let spy = sinon.spy(clientStub, 'getFixtures');

      await job.start(queueStub)   
            
      expect(spy).to.have.been.calledOnce
        .and.to.have.been.calledWith(competitionId);
    })

    it('should call fixtureRepo.findEachBySeasonAndSlugAndUpdate$', async () => {
      let spy = sinon.spy(fixtureRepoStub, 'findEachBySeasonAndSlugAndUpdate$');
      
      await job.start(queueStub)   
            
      expect(spy).to.have.been.calledOnce
        .and.to.have.been.calledWith(sinon.match.array);
    })
  })
})