"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const db = require("../../src/db/index");
const index_1 = require("../../src/config/environment/index");
const league_model_1 = require("../../src/db/models/league.model");
const season_model_1 = require("../../src/db/models/season.model");
const leaderboard_repo_1 = require("../../src/db/repositories/leaderboard.repo");
const leaderboard_model_1 = require("../../src/db/models/leaderboard.model");
const epl = {
    name: 'English Premier League',
    slug: 'english_premier_league',
    code: 'epl'
};
let epl17 = {
    name: "2017-2018",
    slug: "17-18",
    year: 2017,
    seasonStart: '2017-08-11T00:00:00+0200',
    seasonEnd: '2018-05-13T16:00:00+0200',
    currentMatchRound: 20,
    currentGameRound: 20,
    league: null
};
let leaderboardRepo = leaderboard_repo_1.LeaderboardRepository.getInstance();
let season;
describe('Leaderboard Repo', function () {
    this.timeout(5000);
    before(done => {
        db.init(index_1.config.testDb.uri, done, { drop: true });
    });
    before(done => {
        db.init(index_1.config.testDb.uri, done, { drop: true });
    });
    beforeEach(done => {
        league_model_1.LeagueModel.create(epl)
            .then(l => {
            let { name, slug, id } = l;
            epl17.league = { name, slug, id };
            return season_model_1.SeasonModel.create(epl17);
        })
            .then(s => {
            season = s;
            done();
        });
    });
    afterEach(done => {
        db.drop().then(() => { done(); });
    });
    after(done => {
        db.close().then(() => { done(); });
    });
    describe('findBoardAndUpsert$', () => {
        let now = new Date();
        let month = now.getUTCMonth() + 1;
        let year = now.getFullYear();
        let gameRound = 20;
        it('should create seasonBoard if it doesnt exist', done => {
            leaderboardRepo.findSeasonBoardAndUpsert$(season.id, { status: leaderboard_model_1.BoardStatus.UPDATING_SCORES })
                .subscribe(lb => {
                chai_1.expect(lb.status).to.equal(leaderboard_model_1.BoardStatus.UPDATING_SCORES);
                chai_1.expect(lb.season.toString()).to.equal(season.id);
                chai_1.expect(lb.boardType).to.equal(leaderboard_model_1.BoardType.GLOBAL_SEASON);
                done();
            });
        });
        it('should update seasonBoard if it exists', done => {
            let leaderboard;
            leaderboardRepo.findSeasonBoardAndUpsert$(season.id, { status: leaderboard_model_1.BoardStatus.UPDATING_SCORES })
                .flatMap(lb => {
                leaderboard = lb;
                return leaderboardRepo.findSeasonBoardAndUpsert$(season.id, { status: leaderboard_model_1.BoardStatus.UPDATING_RANKINGS });
            })
                .subscribe(lb => {
                chai_1.expect(lb.id).to.equal(leaderboard.id);
                chai_1.expect(lb.status).to.equal(leaderboard_model_1.BoardStatus.UPDATING_RANKINGS);
                done();
            });
        });
        it('should create monthBoard if it doesnt exist', done => {
            leaderboardRepo.findMonthBoardAndUpsert$(season.id, year, month, { status: leaderboard_model_1.BoardStatus.UPDATING_SCORES })
                .subscribe(lb => {
                chai_1.expect(lb.status).to.equal(leaderboard_model_1.BoardStatus.UPDATING_SCORES);
                chai_1.expect(lb.season.toString()).to.equal(season.id);
                chai_1.expect(lb.boardType).to.equal(leaderboard_model_1.BoardType.GLOBAL_MONTH);
                chai_1.expect(lb.year).to.equal(year);
                chai_1.expect(lb.month).to.equal(month);
                done();
            });
        });
        it('should create roundBoard if it doesnt exist', done => {
            leaderboardRepo.findRoundBoardAndUpsert$(season.id, gameRound, { status: leaderboard_model_1.BoardStatus.UPDATING_SCORES })
                .subscribe(lb => {
                chai_1.expect(lb.status).to.equal(leaderboard_model_1.BoardStatus.UPDATING_SCORES);
                chai_1.expect(lb.season.toString()).to.equal(season.id);
                chai_1.expect(lb.boardType).to.equal(leaderboard_model_1.BoardType.GLOBAL_ROUND);
                chai_1.expect(lb.gameRound).to.equal(gameRound);
                done();
            });
        });
    });
    describe('finders', () => {
        let lb1;
        beforeEach((done) => {
            leaderboard_model_1.LeaderboardModel.create([
                {
                    status: leaderboard_model_1.BoardStatus.UPDATING_SCORES,
                    boardType: leaderboard_model_1.BoardType.GLOBAL_SEASON,
                    season: season.id
                }, {
                    status: leaderboard_model_1.BoardStatus.UPDATING_SCORES,
                    boardType: leaderboard_model_1.BoardType.GLOBAL_MONTH,
                    season: season.id,
                    year: 2018,
                    month: 4
                }, {
                    status: leaderboard_model_1.BoardStatus.REFRESHED,
                    boardType: leaderboard_model_1.BoardType.GLOBAL_ROUND,
                    season: season.id,
                    gameRound: 20
                }
            ]).then(lbs => { lb1 = lbs[0]; done(); });
        });
        afterEach((done) => {
            leaderboard_model_1.LeaderboardModel.remove({}).then(() => done());
        });
        it('should find all by season and status', (done) => {
            leaderboardRepo.findAll$({ season: season.id, status: leaderboard_model_1.BoardStatus.UPDATING_SCORES })
                .subscribe(lbs => {
                chai_1.expect(lbs).to.have.length(2);
                done();
            });
        });
        it('should find by id and update status', (done) => {
            leaderboardRepo.findByIdAndUpdate$(lb1.id, { status: leaderboard_model_1.BoardStatus.UPDATING_RANKINGS })
                .subscribe(lb => {
                chai_1.expect(lb).to.have.property('status', leaderboard_model_1.BoardStatus.UPDATING_RANKINGS);
                done();
            });
        });
    });
});
//# sourceMappingURL=leaderboard.repo.spec.js.map