"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
const rxjs_1 = require("rxjs");
const league_data_1 = require("../fixtures/testData/league_data");
const league_controller_1 = require("../../src/app/api/league/league.controller");
let mockLeagueService = {
    getAllLeagues$() { return rxjs_1.Observable.of(league_data_1.newLeagues); }
};
describe('League Controller', () => {
    it('should get all leagues', () => {
        let res = { status(stat) { return this; },
            json(result) {
                expect(result).to.be.an.instanceof(Array);
                expect(result[0].name).to.equal("test123");
            }
        };
        let spy = sinon.spy(mockLeagueService, 'getAllLeagues$');
        const leagueController = new league_controller_1.LeagueController(mockLeagueService);
        leagueController.list({}, res);
        expect(spy).to.have.been.called;
        spy.restore();
    });
});
//# sourceMappingURL=league.controller.spec.js.map