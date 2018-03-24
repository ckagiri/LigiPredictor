import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';

import { CompetitionJob } from '../../../src/import/apiFootballData/competition.job';
import { FixturesJob } from '../../../src/import/apiFootballData/fixtures.job';

let competition = require('../../fixtures/requests/apiFootballData.epl2017');
let teams = require('../../fixtures/requests/apiFootballData.epl2017Teams');

let queueStub: any = {
  addJob: (job: any) => {}
}
let clientStub: any = {
  getCompetition: () => {
    return Promise.resolve({
      data: competition,
      metadata: { }
    })
  },
  getTeams: () => {
    return Promise.resolve({
      data: teams,
      metadata: { }
    })
  }
}
let seasonRepoStub: any = {
  findByExternalIdAndUpdate$: () => {
    return Observable.of(competition)
  }
}
let teamRepoStub: any = {
  findByNameAndUpdate$: () => { 
    return Observable.of(teams.teams)
  }
}
let competitionId = 445;
let jobBuilder = CompetitionJob.Builder;
let job = jobBuilder
  .setApiClient(clientStub)
  .setSeasonRepo(seasonRepoStub)
  .setTeamRepo(teamRepoStub)
  .withCompetition(competitionId)
  .build();

describe('ApiFootballData:Competition Job', () => {    
  describe('start', () => {  
    it('should call client.getCompetition', async () => {
      let spy = sinon.spy(clientStub, 'getCompetition');
      await job.start(queueStub)   
            
      expect(spy).to.have.been.calledOnce
        .and.to.have.been.calledWith(competitionId);
    })

    it('should call client.getTeams', async () => {
      let spy = sinon.spy(clientStub, 'getTeams');

      await job.start(queueStub)   
            
      expect(spy).to.have.been.calledOnce
        .and.to.have.been.calledWith(competitionId);
    })

    it('should call teamRepo.findByNameAndUpdate$', async () => {
      let spy = sinon.spy(teamRepoStub, 'findByNameAndUpdate$');

      await job.start(queueStub)   
            
      expect(spy).to.have.been.calledOnce
        .and.to.have.been.calledWith(sinon.match.array);
    })

    it('should call seasonRepo.findByExternalIdAndUpdate$', async () => {
      let spy = sinon.spy(seasonRepoStub, 'findByExternalIdAndUpdate$');   

      await job.start(queueStub)   
            
      expect(spy).to.have.been.calledOnce
        .and.to.have.been.calledWith(sinon.match.object);
    })

    it('should add fixturesJob to queue', async () => {
      let spy = sinon.spy(queueStub, 'addJob');
      
      await job.start(queueStub) 
      
      expect(spy).to.have.been.called
        .and.to.have.been.calledWith(sinon.match.instanceOf(FixturesJob))
    })
  })
})