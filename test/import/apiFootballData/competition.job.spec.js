"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
const competition_job_1 = require("../../../src/import/apiFootballData/competition.job");
const ApiFootballDataClient = require('../../../src/thirdParty/footballApi/apiFootballData/apiClient');
const apiFootballDataClient = ApiFootballDataClient.getInstance();
let queueStub = {
    addJob: (job) => { }
};
let clientStub;
let seasonRepoStub;
let teamRepoStub;
describe.only('start', () => {
    it('should call client.getTeams', () => __awaiter(this, void 0, void 0, function* () {
        clientStub = {
            getCompetition: sinon.spy()
        };
        seasonRepoStub = sinon.stub();
        teamRepoStub = sinon.stub();
        let competitionId = 445;
        let jobBuilder = competition_job_1.CompetitionJob.Builder;
        let job = jobBuilder
            .setApiClient(clientStub)
            .setSeasonRepo(seasonRepoStub)
            .setTeamRepo(teamRepoStub)
            .withCompetition(competitionId)
            .build();
        yield job.start(queueStub);
        expect(clientStub.getCompetition).to.have.been.calledOnce.and
            .to.have.been.calledWith(competitionId);
    }));
});
// teamRepo findByNameAndUpdate
// seasonRepo findByExternalIdAndUpdate
// builds 2 repos and compId;
// start zips 2 above; adds fixturesJob to queue; Consolelog
//# sourceMappingURL=competition.job.spec.js.map