"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const apiProvider_1 = require("../../src/common/apiProvider");
describe.only('ApiProvider', () => {
    describe('Choice', () => {
        it('should return ApiProvider Type', () => {
            chai_1.expect(apiProvider_1.ApiProvider.API_FOOTBALL_DATA).is.an.instanceof(apiProvider_1.ApiProvider);
        });
        it('should return correct string representation', () => {
            chai_1.expect(apiProvider_1.ApiProvider.API_FOOTBALL_DATA.toString()).to.equal('API_FOOTBALL_DATA');
        });
        it('should do equality checks', () => {
            chai_1.expect(apiProvider_1.ApiProvider.API_FOOTBALL_DATA.equals(apiProvider_1.ApiProvider.API_FOOTBALL_DATA)).to.be.true;
            chai_1.expect(apiProvider_1.ApiProvider.API_FOOTBALL_DATA.equals(apiProvider_1.ApiProvider.LIGI)).to.be.false;
        });
    });
});
//# sourceMappingURL=apiProvider.spec.js.map