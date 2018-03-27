"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const footballApiProvider_1 = require("../../src/common/footballApiProvider");
describe('ApiProvider', () => {
    describe('Choice', () => {
        it('should return correct string representation', () => {
            chai_1.expect(footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA.toString()).to.equal('API_FOOTBALL_DATA');
        });
    });
});
//# sourceMappingURL=apiProvider.spec.js.map