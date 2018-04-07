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
const fixtures_job_1 = require("../../../src/import/apiFootballData/fixtures.job");
let fixtures = require('../../fixtures/requests/apiFootballData.epl2017Fixtures');
let clientStub = {
    getFixtures: () => {
        return Promise.resolve({
            data: fixtures
        });
    }
};
let fixtureRepoStub = {
    findEachBySeasonAndSlugAndUpdate$: () => {
        return rxjs_1.Observable.of(fixtures.fixtures);
    }
};
let competitionId = 445;
let jobBuilder = fixtures_job_1.FixturesJob.Builder;
let job = jobBuilder
    .setApiClient(clientStub)
    .setFixtureRepo(fixtureRepoStub)
    .withCompetition(competitionId)
    .build();
let queueStub = sinon.stub();
describe('ApiFootballData:Fixtures Job', () => {
    describe('start', () => {
        it('should call client.getFixtures', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(clientStub, 'getFixtures');
            yield job.start(queueStub);
            expect(spy).to.have.been.calledOnce
                .and.to.have.been.calledWith(competitionId);
        }));
        it('should call fixtureRepo.findEachBySeasonAndSlugAndUpdate$', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(fixtureRepoStub, 'findEachBySeasonAndSlugAndUpdate$');
            yield job.start(queueStub);
            expect(spy).to.have.been.calledOnce
                .and.to.have.been.calledWith(sinon.match.array);
        }));
    });
});
//# sourceMappingURL=fixtures.job.spec.js.map