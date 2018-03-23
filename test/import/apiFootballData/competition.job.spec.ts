import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;

import { CompetitionJob } from '../../../src/import/apiFootballData/competition.job';
import { SeasonRepository } from '../../../src/db/repositories/season.repo';
import { TeamRepository } from '../../../src/db/repositories/team.repo';
import { FootballApiProvider } from '../../../src/common/footballApiProvider';
const ApiFootballDataClient = require('../../../src/thirdParty/footballApi/apiFootballData/apiClient');
const apiFootballDataClient = ApiFootballDataClient.getInstance();

let queueStub: any = {
  addJob: (job: any) => {}
}
let clientStub: any;
let seasonRepoStub: any;
let teamRepoStub: any;

describe.only('start', () => {  
  
  it('should call client.getTeams', async () => {
    clientStub = {
      getCompetition: sinon.spy()
    }
    seasonRepoStub = sinon.stub();
    teamRepoStub = sinon.stub();
    let competitionId = 445;
    let jobBuilder = CompetitionJob.Builder;
    let job = jobBuilder
      .setApiClient(clientStub)
      .setSeasonRepo(seasonRepoStub)
      .setTeamRepo(teamRepoStub)
      .withCompetition(competitionId)
      .build();

    await job.start(queueStub)   
          
    expect(clientStub.getCompetition).to.have.been.calledOnce.and
      .to.have.been.calledWith(competitionId);
  })
})
// teamRepo findByNameAndUpdate
// seasonRepo findByExternalIdAndUpdate

// builds 2 repos and compId;
// start zips 2 above; adds fixturesJob to queue; Consolelog