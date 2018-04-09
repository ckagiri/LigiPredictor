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
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Types.ObjectId;
const rxjs_1 = require("rxjs");
const footballApiProvider_1 = require("../../../src/common/footballApiProvider");
const fixture_model_1 = require("../../../src/db/models/fixture.model");
const fixtures_updater_1 = require("../../../src/app/schedulers/footballApi/fixtures.updater");
let provider = footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA;
let newApiFixture = () => {
    return {
        id: 1,
        status: fixture_model_1.FixtureStatus.FINISHED,
        result: {
            goalsHomeTeam: 1,
            goalsAwayTeam: 1
        }
    };
};
let newDbFixture = () => {
    return {
        id: ObjectId().toHexString(),
        status: fixture_model_1.FixtureStatus.SCHEDULED,
        externalReference: { [provider]: { id: 1 } }
    };
};
let dbFixture = newDbFixture();
let apiFixture = newApiFixture();
let dbFixtures = [dbFixture];
let apiFixtures = [apiFixture];
let fixtureRepoStub;
let fixturesUpdater;
let newFixture = (id, homeTeam, awayTeam, status = fixture_model_1.FixtureStatus.FINISHED) => {
    return {
        homeTeam, awayTeam, status,
        externalReference: {
            [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: { id }
        }
    };
};
describe('FixturesUpdater', () => {
    beforeEach(() => {
        fixtureRepoStub = {
            Provider: provider,
            findByIdAndUpdate$: () => { return rxjs_1.Observable.of(dbFixture); },
            findByExternalIds$: () => {
                return rxjs_1.Observable.of(dbFixtures);
            }
        };
        fixturesUpdater = new fixtures_updater_1.FixturesUpdater(fixtureRepoStub);
    });
    describe('Update Game Details', () => {
        it('should update matchResult if changed', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(fixtureRepoStub, 'findByIdAndUpdate$');
            let res = yield fixturesUpdater.updateGameDetails(apiFixtures);
            expect(spy).to.have.been.calledOnce;
            expect(spy).to.have.been.calledWithMatch(dbFixture.id, { result: apiFixture.result, status: apiFixture.status });
            fixtureRepoStub.findByIdAndUpdate$.restore();
        }));
        xit('should update matchOdds if changed', () => {
        });
        xit('should update matchStatus if changed', () => {
        });
        xit('it should not make update call if result, odds or status hasnt changed');
    });
});
//# sourceMappingURL=fixtures.updater.spec.js.map