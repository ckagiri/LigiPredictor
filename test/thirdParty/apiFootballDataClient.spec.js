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
//import { ApifootballDataClient } from '../../src/thirdParty/footballApi/apiFootballData/apiClient';
describe('apifootballDataClient', () => {
    let apifootballDataClient;
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
    describe.skip('getCompetitions', () => {
        it('should get competitions by year', () => __awaiter(this, void 0, void 0, function* () {
            const response = yield apifootballDataClient.getCompetitions(2017);
            chai_1.expect(response.data).to.be.an('array');
            chai_1.expect(response.metadata).to.be.an('object');
        })).timeout(0);
    });
    describe('getCompetions', () => {
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
            let apifootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
            const response = yield apifootballDataClient.getCompetitions(2015);
            chai_1.expect(response.data).to.be.an('array');
            chai_1.expect(response.metadata).to.be.an('object');
        }));
    });
});
//# sourceMappingURL=apiFootballDataClient.spec.js.map