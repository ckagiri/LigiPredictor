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
const chai_1 = require("chai");
const mockery = require("mockery");
const sinon = require("sinon");
const apiClient_1 = require("../../src/thirdParty/footballApi/apiClient");
const footballApiProvider_1 = require("../../src/common/footballApiProvider");
describe('apifootballDataClient', () => {
    describe('getCompetitions', () => {
        before(() => {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });
        });
        after(() => {
            mockery.disable();
        });
        it('should get real competitions by year', () => __awaiter(this, void 0, void 0, function* () {
            let apiClient = apiClient_1.FootballApiClient.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
            const response = yield apiClient.getCompetitions(2017);
            chai_1.expect(response.data).to.be.an('array');
            chai_1.expect(response.metadata).to.be.an('object');
        })).timeout(0);
        it('should get competitions by year', () => __awaiter(this, void 0, void 0, function* () {
            let competitions = require('../fixtures/requests/apiFootballData.competitions2017');
            let response = {
                body: JSON.stringify(competitions),
                headers: {
                    'x-requests-available': '49',
                    'x-requestcounter-reset': '60'
                }
            };
            let requestStub = sinon.stub().returns(Promise.resolve(response));
            mockery.registerMock('request-promise', requestStub);
            let ApiFootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
            let apiFootballDataClient = ApiFootballDataClient.getInstance();
            const { data, metadata } = yield apiFootballDataClient.getCompetitions(2017);
            chai_1.expect(data).to.be.an('array');
            chai_1.expect(metadata).to.be.an('object');
        }));
    });
    describe('getCompetition', () => {
        before(() => {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });
        });
        after(() => {
            mockery.disable();
        });
        it('should get real competition by id', () => __awaiter(this, void 0, void 0, function* () {
            let apiClient = apiClient_1.FootballApiClient.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
            const { data, metadata } = yield apiClient.getCompetition(445);
            chai_1.expect(data).to.be.an('object');
            chai_1.expect(metadata).to.be.an('object');
        })).timeout(0);
        it('should get competition by id', () => __awaiter(this, void 0, void 0, function* () {
            let competition = require('../fixtures/requests/apiFootballData.epl2017');
            let response = {
                body: JSON.stringify(competition),
                headers: {
                    'x-requests-available': '49',
                    'x-requestcounter-reset': '60'
                }
            };
            let requestStub = sinon.stub().returns(Promise.resolve(response));
            mockery.registerMock('request-promise', requestStub);
            let ApiFootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
            let apiFootballDataClient = ApiFootballDataClient.getInstance();
            const { data, metadata } = yield apiFootballDataClient.getCompetition(445);
            chai_1.expect(data).to.be.an('object');
            chai_1.expect(metadata).to.be.an('object');
        }));
    });
    describe('getTeams', () => {
        before(() => {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });
        });
        after(() => {
            mockery.disable();
        });
        it('should get real teams by competition', () => __awaiter(this, void 0, void 0, function* () {
            let apiClient = apiClient_1.FootballApiClient.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
            const { data, metadata } = yield apiClient.getTeams(445);
            chai_1.expect(data).to.be.an('object');
            chai_1.expect(metadata).to.be.an('object');
            chai_1.expect(data.count).to.be.a('number');
            chai_1.expect(data.teams).to.be.an('array');
        })).timeout(0);
        it('should get teams by competition', () => __awaiter(this, void 0, void 0, function* () {
            let teams = require('../fixtures/requests/apiFootballData.epl2017Teams');
            let response = {
                body: JSON.stringify(teams),
                headers: {
                    'x-requests-available': '49',
                    'x-requestcounter-reset': '60'
                }
            };
            let requestStub = sinon.stub().returns(Promise.resolve(response));
            mockery.registerMock('request-promise', requestStub);
            let ApiFootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
            let apiFootballDataClient = ApiFootballDataClient.getInstance();
            const { data, metadata } = yield apiFootballDataClient.getTeams(415);
            chai_1.expect(data).to.be.an('object');
            chai_1.expect(metadata).to.be.an('object');
            chai_1.expect(data.count).to.exist;
            chai_1.expect(data.teams).to.be.exist;
        }));
    });
    describe('getFixtures', () => {
        before(() => {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });
        });
        after(() => {
            mockery.disable();
        });
        it('should get real fixtures by competition', () => __awaiter(this, void 0, void 0, function* () {
            let apiClient = apiClient_1.FootballApiClient.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
            const { data, metadata } = yield apiClient.getFixtures(445);
            chai_1.expect(data).to.be.an('object');
            chai_1.expect(metadata).to.be.an('object');
            chai_1.expect(data.count).to.be.a('number');
            chai_1.expect(data.fixtures).to.be.an('array');
        })).timeout(0);
        it('should get fixtures by competition', () => __awaiter(this, void 0, void 0, function* () {
            let fixtures = require('../fixtures/requests/apiFootballData.epl2017Fixtures');
            let response = {
                body: JSON.stringify(fixtures),
                headers: {
                    'x-requests-available': '49',
                    'x-requestcounter-reset': '60'
                }
            };
            let requestStub = sinon.stub().returns(Promise.resolve(response));
            mockery.registerMock('request-promise', requestStub);
            let ApiFootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
            let apiFootballDataClient = ApiFootballDataClient.getInstance();
            const { data, metadata } = yield apiFootballDataClient.getFixtures(445);
            chai_1.expect(data).to.be.an('object');
            chai_1.expect(metadata).to.be.an('object');
            chai_1.expect(data.count).to.exist;
            chai_1.expect(data.fixtures).to.be.exist;
        }));
    });
});
//# sourceMappingURL=apiFootballDataClient.spec.js.map