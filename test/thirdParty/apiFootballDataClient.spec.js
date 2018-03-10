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
const apiClient_1 = require("../../src/thirdParty/footballApi/apiFootballData/apiClient");
describe('apifootballDataClient', () => {
    let apifootballDataClient;
    before(() => {
        apifootballDataClient = apiClient_1.ApifootballDataClient.getInstance();
    });
    describe('getCompetitions', () => {
        it('should get competitions by year', () => __awaiter(this, void 0, void 0, function* () {
            const response = yield apifootballDataClient.getCompetitions(2017);
            chai_1.expect(response.data).to.be.an('array');
            chai_1.expect(response.metadata).to.be.an('object');
        })).timeout(0);
    });
});
//# sourceMappingURL=apiFootballDataClient.spec.js.map