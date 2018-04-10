import { Observable } from 'rxjs'
import { expect } from 'chai';

import * as db from '../../src/db/index';
import { config } from '../../src/config/environment/index';
import { LeagueModel as League } from '../../src/db/models/league.model';
import { SeasonModel as Season } from '../../src/db/models/season.model';
import { LeaderboardRepository } from '../../src/db/repositories/leaderboard.repo';
import { ILeaderboard, ILeaderboardModel, LeaderboardModel as Leaderboard, BoardStatus, BoardType  } from '../../src/db/models/leaderboard.model';

const epl = {
  name: 'English Premier League',
  slug: 'english_premier_league',
  code: 'epl'
}

let epl17 = {
  name: "2017-2018",
  slug: "17-18",
  year: 2017,
  seasonStart: '2017-08-11T00:00:00+0200',
  seasonEnd: '2018-05-13T16:00:00+0200',
  currentMatchRound: 20,
  currentGameRound: 20,
  league: null
}

let leaderboardRepo = LeaderboardRepository.getInstance();
let season: any;

describe('Leaderboard Repo', function () {
  this.timeout(5000);
  before(done => {
    db.init(config.testDb.uri, done, { drop: true });
  })
  beforeEach(done => {
    League.create(epl)
      .then(l => {
        let { name, slug, id } = l;
        epl17.league = { name, slug, id };
        return Season.create(epl17);
    })
    .then(s => {
      season = s;
      done();
    })
  })
  afterEach(done => { 
    db.drop().then(() => { done(); })
  })
  after(done => {
    db.close().then(() => { done(); })
  })
  describe('findBoardAndUpsert$', () => {
    let now = new Date(); let month = now.getUTCMonth() + 1; let year = now.getFullYear(); let gameRound = 20;
    it('should create seasonBoard if it doesnt exist', done => {
      leaderboardRepo.findSeasonBoardAndUpsert$(season.id, { status: BoardStatus.UPDATING_SCORES })
        .subscribe(lb => {
            expect(lb.status).to.equal(BoardStatus.UPDATING_SCORES);
            expect(lb.season.toString()).to.equal(season.id);
            expect(lb.boardType).to.equal(BoardType.GLOBAL_SEASON);
            done();
          })
    })

    it('should update seasonBoard if it exists', done => {
      let leaderboard: ILeaderboard;
      leaderboardRepo.findSeasonBoardAndUpsert$(season.id, { status: BoardStatus.UPDATING_SCORES })
        .flatMap(lb => {
          leaderboard = lb;
          return leaderboardRepo.findSeasonBoardAndUpsert$(season.id, { status: BoardStatus.UPDATING_RANKINGS })
        })
        .subscribe(lb => {
          expect(lb.id).to.equal(leaderboard.id)
          expect(lb.status).to.equal(BoardStatus.UPDATING_RANKINGS);
          done();
        })
    })

    it('should create monthBoard if it doesnt exist', done => {
      leaderboardRepo.findMonthBoardAndUpsert$(season.id, year, month, { status: BoardStatus.UPDATING_SCORES })
        .subscribe(lb => {
            expect(lb.status).to.equal(BoardStatus.UPDATING_SCORES);
            expect(lb.season.toString()).to.equal(season.id);
            expect(lb.boardType).to.equal(BoardType.GLOBAL_MONTH);
            expect(lb.year).to.equal(year);
            expect(lb.month).to.equal(month);
            done();
          })
    })
        
    it('should create roundBoard if it doesnt exist', done => {
      leaderboardRepo.findRoundBoardAndUpsert$(season.id, gameRound, { status: BoardStatus.UPDATING_SCORES })
        .subscribe(lb => {
            expect(lb.status).to.equal(BoardStatus.UPDATING_SCORES);
            expect(lb.season.toString()).to.equal(season.id);
            expect(lb.boardType).to.equal(BoardType.GLOBAL_ROUND);
            expect(lb.gameRound).to.equal(gameRound);
            done();
          })
    })
  })

  describe('finders', () => {
    let lb1: ILeaderboard;
    beforeEach((done) => {
      Leaderboard.create([
        {
          status: BoardStatus.UPDATING_SCORES,
          boardType: BoardType.GLOBAL_SEASON,
          season: season.id
        },{
          status: BoardStatus.UPDATING_SCORES,
          boardType: BoardType.GLOBAL_MONTH,
          season: season.id,
          year: 2018,
          month: 4
        },{
          status: BoardStatus.REFRESHED,
          boardType: BoardType.GLOBAL_ROUND,
          season: season.id,
          gameRound: 20         
        }
      ]).then(lbs => { lb1 = lbs[0]; done() });
    })
    afterEach((done) => {
      Leaderboard.remove({}).then(() => done());
    })
    it('should find all by season and status', (done) => {
      leaderboardRepo.findAll$({ season: season.id, status: BoardStatus.UPDATING_SCORES })
        .subscribe(lbs => {
          expect(lbs).to.have.length(2)
          done();
        })
    })    
    it('should find by id and update status', (done) => {
      leaderboardRepo.findByIdAndUpdate$(lb1.id, { status: BoardStatus.UPDATING_RANKINGS })
        .subscribe(lb => {
          expect(lb).to.have.property('status', BoardStatus.UPDATING_RANKINGS);
          done();
        })      
    })    
  })
})