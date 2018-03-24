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
const rxjs_1 = require("rxjs");
const competition_job_1 = require("../../../src/import/apiFootballData/competition.job");
const fixtures_job_1 = require("../../../src/import/apiFootballData/fixtures.job");
let competition = require('../../fixtures/requests/apiFootballData.epl2017');
let teams = require('../../fixtures/requests/apiFootballData.epl2017Teams');
let queueStub = {
    addJob: (job) => { }
};
let clientStub = {
    getCompetition: () => {
        return Promise.resolve({
            data: competition,
            metadata: {}
        });
    },
    getTeams: () => {
        return Promise.resolve({
            data: teams,
            metadata: {}
        });
    }
};
let seasonRepoStub = {
    findByExternalIdAndUpdate$: () => {
        return rxjs_1.Observable.of(competition);
    }
};
let teamRepoStub = {
    findByNameAndUpdate$: () => {
        return rxjs_1.Observable.of(teams.teams);
    }
};
let competitionId = 445;
let jobBuilder = competition_job_1.CompetitionJob.Builder;
let job = jobBuilder
    .setApiClient(clientStub)
    .setSeasonRepo(seasonRepoStub)
    .setTeamRepo(teamRepoStub)
    .withCompetition(competitionId)
    .build();
describe('ApiFootballData:Competition Job', () => {
    describe('start', () => {
        it('should call client.getCompetition', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(clientStub, 'getCompetition');
            yield job.start(queueStub);
            expect(spy).to.have.been.calledOnce
                .and.to.have.been.calledWith(competitionId);
        }));
        it('should call client.getTeams', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(clientStub, 'getTeams');
            yield job.start(queueStub);
            expect(spy).to.have.been.calledOnce
                .and.to.have.been.calledWith(competitionId);
        }));
        it('should call teamRepo.findByNameAndUpdate$', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(teamRepoStub, 'findByNameAndUpdate$');
            yield job.start(queueStub);
            expect(spy).to.have.been.calledOnce
                .and.to.have.been.calledWith(sinon.match.array);
        }));
        it('should call seasonRepo.findByExternalIdAndUpdate$', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(seasonRepoStub, 'findByExternalIdAndUpdate$');
            yield job.start(queueStub);
            expect(spy).to.have.been.calledOnce
                .and.to.have.been.calledWith(sinon.match.object);
        }));
        it('should add fixturesJob to queue', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(queueStub, 'addJob');
            yield job.start(queueStub);
            expect(spy).to.have.been.called
                .and.to.have.been.calledWith(sinon.match.instanceOf(fixtures_job_1.FixturesJob));
        }));
    });
});
//# sourceMappingURL=competition.job.spec.js.map