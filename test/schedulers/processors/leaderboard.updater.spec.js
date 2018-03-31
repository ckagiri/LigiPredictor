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
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Types.ObjectId;
const footballApiProvider_1 = require("../../../src/common/footballApiProvider");
const leaderboard_updater_1 = require("../../../src/app/schedulers/leaderboard.updater");
const fixture_model_1 = require("../../../src/db/models/fixture.model");
let newFixture = (id, homeTeam, awayTeam, status = fixture_model_1.FixtureStatus.FINISHED) => {
    return {
        _id: ObjectId().toHexString(),
        season: '4edd40c86762e0fb12000001',
        gameRound: 2,
        homeTeam, awayTeam, status,
        result: { goalsHomeTeam: 2, goalsAwayTeam: 1 },
        allPredictionsProcessed: false,
        externalReference: {
            [footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA]: { id }
        }
    };
};
let ars_che = newFixture(1, 'Arsenal', 'Chelsea');
let liv_sou = newFixture(2, 'Liverpool', 'Southampton');
let eve_wat = newFixture(3, 'Everton', 'Watford', fixture_model_1.FixtureStatus.IN_PLAY);
let finishedFixtures = [ars_che, liv_sou, eve_wat];
let leaderboardRepoStub = {
    findSeasonAndUpdate$: sinon.stub()
};
let chalo = {
    _id: ObjectId().toHexString(),
    userName: 'chalo'
};
let kagiri = {
    _id: ObjectId().toHexString(),
    userName: 'kagiri'
};
let userRepoStub = {
    findAll$: () => { return rxjs_1.Observable.of([chalo, kagiri]); }
};
let leaderboardUpdater = new leaderboard_updater_1.LeaderboardUpdater(userRepoStub);
describe.only('Leaderboard Updater', () => {
    describe('updateScores', () => {
        it('should getUsers', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(userRepoStub, 'findAll$');
            yield leaderboardUpdater.updateScores(finishedFixtures);
            expect(spy).to.have.been.calledTwice;
        }));
        xdescribe('getLeaderBoards', () => {
            it('should getSeasonboard', () => __awaiter(this, void 0, void 0, function* () {
                let spy = leaderboardRepoStub.findSeasonAndUpdate$;
                yield leaderboardUpdater.updateScores(finishedFixtures);
                expect(spy).to.have.been.called;
            }));
            xit('should have seasonBoard with UpdatingScores status', () => {
            });
            xit('should getMonthboard', () => {
            });
            xit('should have monthBoard with UpdatingScores status', () => {
            });
            xit('should getRoundboard', () => {
            });
            xit('should have roundBoard with UpdatingScores status', () => {
            });
            it('should cache boards', () => {
            });
        });
        xit('should save userScores', () => {
        });
    });
    xdescribe('UpdateRankings', () => {
    });
});
//# sourceMappingURL=leaderboard.updater.spec.js.map