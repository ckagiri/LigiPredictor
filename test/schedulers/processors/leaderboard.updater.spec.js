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
const prediction_model_1 = require("../../../src/db/models/prediction.model");
const leaderboard_model_1 = require("../../../src/db/models/leaderboard.model");
const cacheService_1 = require("../../../src/common/cacheService");
let seasonId = '4edd40c86762e0fb12000001';
let gameRound = 2;
let newFixture = (id, homeTeam, awayTeam, status = fixture_model_1.FixtureStatus.FINISHED) => {
    return {
        id: ObjectId().toHexString(),
        season: seasonId,
        gameRound,
        date: new Date(),
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
let newPrediction = (userId, fixture, status = prediction_model_1.PredictionStatus.PENDING) => {
    return {
        id: ObjectId().toHexString(), user: userId, fixture, status, choice: { goalsHomeTeam: 1, goalsAwayTeam: 1 }, hasJoker: false,
        points: { points: 0, pointsFor: 0, pointsAgainst: 0, MatchOutcomePoints: 0, GoalDifferencePoints: 0, TeamScorePoints: 0 }
    };
};
let finishedFixtures = [ars_che, liv_sou, eve_wat];
let leaderboardRepoStub = {
    findSeasonBoardAndUpsert$: sinon.stub(),
    findMonthBoardAndUpsert$: sinon.stub(),
    findRoundBoardAndUpsert$: sinon.stub(),
    findAll$: sinon.stub(),
    findByIdAndUpdate$: sinon.stub()
};
let chalo = {
    id: ObjectId().toHexString(),
    userName: 'chalo'
};
let kagiri = {
    id: ObjectId().toHexString(),
    userName: 'kagiri'
};
let pred1 = newPrediction(chalo.id, ars_che);
let lb1 = { id: ObjectId().toHexString() };
let lb2 = { id: ObjectId().toHexString() };
let standing1 = {
    id: ObjectId().toHexString(),
    leaderboard: lb1.id,
    user: kagiri.id,
    points: 20,
    positionOld: 1,
    positionNew: 1
};
let standing2 = {
    id: ObjectId().toHexString(),
    leaderboard: lb1.id,
    user: chalo.id,
    points: 30,
    positionOld: 2,
    positionNew: 2
};
let userRepoStub = {
    findAll$: () => { return rxjs_1.Observable.of([chalo, kagiri]); }
};
let predictionRepoStub = {
    findOne$: () => { return rxjs_1.Observable.of(pred1); }
};
let userScoreRepoStub = {
    findOneAndUpsert$: () => { return rxjs_1.Observable.of({ id: ObjectId().toHexString() }); },
    findByLeaderboardOrderByPoints$: () => { return rxjs_1.Observable.of([standing2, standing1]); },
    findByIdAndUpdate$: () => { return rxjs_1.Observable.of(standing1); }
};
let leaderboardUpdater = new leaderboard_updater_1.LeaderboardUpdater(userRepoStub, leaderboardRepoStub, predictionRepoStub, userScoreRepoStub);
describe('Leaderboard Updater', () => {
    describe('updateScores', () => {
        beforeEach(() => {
            leaderboardRepoStub.findSeasonBoardAndUpsert$.returns(rxjs_1.Observable.of({ id: 1 }));
            leaderboardRepoStub.findMonthBoardAndUpsert$.returns(rxjs_1.Observable.of({ id: 2 }));
            leaderboardRepoStub.findRoundBoardAndUpsert$.returns(rxjs_1.Observable.of({ id: 3 }));
            leaderboardRepoStub.findAll$.returns(rxjs_1.Observable.of([lb1]));
            leaderboardRepoStub.findByIdAndUpdate$.returns(rxjs_1.Observable.of(lb1));
        });
        afterEach(() => {
            leaderboardRepoStub.findSeasonBoardAndUpsert$ = sinon.stub();
            leaderboardRepoStub.findMonthBoardAndUpsert$ = sinon.stub();
            leaderboardRepoStub.findRoundBoardAndUpsert$ = sinon.stub();
        });
        it('should getUsers', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(userRepoStub, 'findAll$');
            yield leaderboardUpdater.updateScores(finishedFixtures);
            expect(spy).to.have.been.calledTwice;
        }));
        it('should get Seasonboard and set status to UPDATING_SCORES ', () => __awaiter(this, void 0, void 0, function* () {
            let spy = leaderboardRepoStub.findSeasonBoardAndUpsert$;
            yield leaderboardUpdater.updateScores(finishedFixtures);
            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(seasonId, { status: leaderboard_model_1.BoardStatus.UPDATING_SCORES });
        }));
        it('should get Monthboard and set status to UPDATING_SCORES ', () => __awaiter(this, void 0, void 0, function* () {
            let spy = leaderboardRepoStub.findMonthBoardAndUpsert$;
            yield leaderboardUpdater.updateScores(finishedFixtures);
            expect(spy).to.have.been.called;
            let month = ars_che.date.getUTCMonth() + 1;
            let year = ars_che.date.getFullYear();
            expect(spy.firstCall).to.have.been.calledWith(seasonId, year, month, { status: leaderboard_model_1.BoardStatus.UPDATING_SCORES });
        }));
        it('should get Roundboard and set status to UPDATING_SCORES ', () => __awaiter(this, void 0, void 0, function* () {
            let spy = leaderboardRepoStub.findRoundBoardAndUpsert$;
            yield leaderboardUpdater.updateScores(finishedFixtures);
            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(seasonId, gameRound, { status: leaderboard_model_1.BoardStatus.UPDATING_SCORES });
        }));
        it('should get fixture prediction for the user', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(predictionRepoStub, 'findOne$');
            yield leaderboardUpdater.updateScores(finishedFixtures);
            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(sinon.match({ userId: chalo.id, fixtureId: ars_che.id }));
        }));
        it('should cache boards', () => __awaiter(this, void 0, void 0, function* () {
            let spy = leaderboardRepoStub.findSeasonBoardAndUpsert$;
            leaderboardUpdater.setCacheService(new cacheService_1.CacheService);
            yield leaderboardUpdater.updateScores(finishedFixtures);
            expect(spy).to.have.callCount(4);
        }));
        it('should save userScores', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(userScoreRepoStub, 'findOneAndUpsert$');
            let count = yield leaderboardUpdater.updateScores(finishedFixtures);
            expect(spy).to.have.been.called;
            expect(spy.getCall(0).args.length).to.equal(6);
        }));
    });
    describe('UpdateRankings', () => {
        it('should get leaderboards that have UPDATING_SCORES status', () => __awaiter(this, void 0, void 0, function* () {
            let spy = leaderboardRepoStub.findAll$;
            yield leaderboardUpdater.updateRankings(seasonId);
            expect(spy).to.have.been.called;
        }));
        it('should change leaderboard status to UPDATING_RANKINGS', () => __awaiter(this, void 0, void 0, function* () {
            let spy = leaderboardRepoStub.findByIdAndUpdate$;
            yield leaderboardUpdater.updateRankings(seasonId);
            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(sinon.match.string, sinon.match({ status: leaderboard_model_1.BoardStatus.UPDATING_RANKINGS }));
        }));
        it('should get userScores from leaderboard ordered by points', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(userScoreRepoStub, 'findByLeaderboardOrderByPoints$');
            yield leaderboardUpdater.updateRankings(seasonId);
            expect(spy).to.have.been.called;
            userScoreRepoStub.findByLeaderboardOrderByPoints$.restore();
        }));
        it('should update positions', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(userScoreRepoStub, 'findByIdAndUpdate$');
            let count = yield leaderboardUpdater.updateRankings(seasonId);
            expect(spy).to.have.been.called;
            expect(spy.firstCall).to.have.been.calledWith(sinon.match.string, { positionNew: 1, positionOld: 2 });
            expect(spy.secondCall).to.have.been.calledWith(sinon.match.string, { positionNew: 2, positionOld: 1 });
        }));
    });
    describe('SetLeaderboardsToRefreshed', () => {
        it('should get leaderboards that have UPDATING_RANKINGS status', () => __awaiter(this, void 0, void 0, function* () {
            let spy = leaderboardRepoStub.findAll$;
            yield leaderboardUpdater.markLeaderboardsAsRefreshed(seasonId);
            expect(spy).to.have.been.called;
        }));
        it('should change leaderboard status to REFRESHED', () => __awaiter(this, void 0, void 0, function* () {
            let spy = leaderboardRepoStub.findByIdAndUpdate$;
            let count = yield leaderboardUpdater.markLeaderboardsAsRefreshed(seasonId);
            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(sinon.match.string, sinon.match({ status: leaderboard_model_1.BoardStatus.UPDATING_RANKINGS }));
        }));
    });
});
//# sourceMappingURL=leaderboard.updater.spec.js.map