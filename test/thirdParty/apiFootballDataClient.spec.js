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
    before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
    });
    beforeEach(() => {
        mockery.registerAllowable();
    });
    afterEach(() => {
        mockery.deregisterAll();
    });
    after(() => {
        mockery.disable();
    });
    describe('getCompetitions', () => {
        it('should get real competitions by year', () => __awaiter(this, void 0, void 0, function* () {
            let apiClient = apiClient_1.FootballApiClient.getInstance(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA);
            const response = yield apiClient.getCompetitions(2017);
            chai_1.expect(response.data).to.be.an('array');
            chai_1.expect(response.metadata).to.be.an('object');
        })).timeout(0);
    });
    describe('getCompetitions', () => {
        let bodyResponse = require('../fixtures/requests/apiFootballData.competitions2017');
        let response = {
            body: JSON.stringify(bodyResponse),
            headers: {
                'x-requests-available': '49',
                'x-requestcounter-reset': '60'
            }
        };
        let requestStub = sinon.stub().returns(Promise.resolve(response));
        mockery.registerMock('request-promise', requestStub);
        it('should get competitions by year', () => __awaiter(this, void 0, void 0, function* () {
            let ApiFootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
            let apiFootballDataClient = ApiFootballDataClient.getInstance();
            const response = yield apiFootballDataClient.getCompetitions(2015);
            chai_1.expect(response.data).to.be.an('array');
            chai_1.expect(response.metadata).to.be.an('object');
        }));
    });
});
//# sourceMappingURL=apiFootballDataClient.spec.js.map