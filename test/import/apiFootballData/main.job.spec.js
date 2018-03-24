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
const main_job_1 = require("../../../src/import/apiFootballData/main.job");
const competition_job_1 = require("../../../src/import/apiFootballData/competition.job");
let competitions = require('../../fixtures/requests/apiFootballData.competitions2017');
let queueStub = {
    addJob: (job) => { }
};
let clientStub = {
    getCompetitions: () => {
        return Promise.resolve({
            data: competitions,
            metadata: {}
        });
    }
};
let seasonRepoStub = sinon.stub();
let teamRepoStub = sinon.stub();
describe('ApiFootballData:Main Job', () => {
    describe('start', () => {
        it('should call client.getCompetitions', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(clientStub, 'getCompetitions');
            let mainJob = new main_job_1.MainJob(clientStub, seasonRepoStub, teamRepoStub);
            yield mainJob.start(queueStub);
            expect(spy).to.be.called;
            clientStub.getCompetitions.restore();
        }));
        it('should call client.getCompetitions with a given year', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(clientStub, 'getCompetitions');
            let mainJob = new main_job_1.MainJob(clientStub, seasonRepoStub, teamRepoStub);
            yield mainJob.start(queueStub);
            expect(spy).to.have.been.calledWith(2017);
        }));
        describe('with given year', () => {
            it('should add CompetitionJobs to queue', () => __awaiter(this, void 0, void 0, function* () {
                let spy = sinon.spy(queueStub, 'addJob');
                let mainJob = new main_job_1.MainJob(clientStub, seasonRepoStub, teamRepoStub);
                yield mainJob.start(queueStub);
                expect(spy).to.have.been.called;
                expect(spy).to.have.been.calledWith(sinon.match.instanceOf(competition_job_1.CompetitionJob));
            }));
        });
    });
});
//# sourceMappingURL=main.job.spec.js.map