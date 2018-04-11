import { Observable } from 'rxjs';

import { IFixture, FixtureStatus }  from '../../db/models/fixture.model';
import { IUserRepository, UserRepository }  from '../../db/repositories/user.repo';
import { BoardStatus, ILeaderboard } from '../../db/models/leaderboard.model';
import { ILeaderboardRepository, LeaderboardRepository }  from '../../db/repositories/leaderboard.repo';
import { IPredictionRepository, PredictionRepository }  from '../../db/repositories/prediction.repo';
import { IUserScoreRepository, UserScoreRepository} from '../../db/repositories/userScore.repo';
import { ICacheService, CacheService } from '../../common/cacheService';

export interface ILeaderboardUpdater {
  updateScores(fixtures: IFixture[])
  updateRankings(seasonId: string)
  markLeaderboardsAsRefreshed(seasonId: string)
}

export class LeaderboardUpdater implements ILeaderboardUpdater {
  static getInstance() {
    return new LeaderboardUpdater(
      UserRepository.getInstance(),
      LeaderboardRepository.getInstance(),
      PredictionRepository.getInstance(),
      UserScoreRepository.getInstance()
    ).setCacheService(new CacheService())
  }
  
  private cacheService: ICacheService;

  constructor(
    private userRepo: IUserRepository,
    private leaderboardRepo: ILeaderboardRepository,
    private predictionRepo: IPredictionRepository,
    private userScoreRepo: IUserScoreRepository
  ) { }

  setCacheService(cacheService: ICacheService) {
    this.cacheService = cacheService;
    return this;
  }

  updateScores(fixtures: IFixture[]) {
    if(this.cacheService != null) {
      this.cacheService.clear();
    }
    return Observable.from(fixtures)
      .filter(fixture => {
        return fixture.status === FixtureStatus.FINISHED  && fixture.allPredictionsProcessed === false;
      })
      .flatMap(fixture => {
        return this.userRepo.findAll$()
          .flatMap(users => {
            return Observable.from(users)
          })  
          .map(user => {
            return { user, fixture }
          })
      })
      .flatMap(data => {
        let { user, fixture } = data;
        let { season, gameRound, date } = fixture;
        let month = date.getUTCMonth() + 1;
        let year = date.getFullYear();
  
        let boards: Observable<ILeaderboard>[] = [];
        let sBoard: Observable<ILeaderboard>;
        let mBoard: Observable<ILeaderboard>;
        let rBoard: Observable<ILeaderboard>;
        
        if(this.cacheService != null) {
          sBoard = this.cacheService.get(`${season}`, 
            this.leaderboardRepo.findSeasonBoardAndUpsert$(season, { status: BoardStatus.UPDATING_SCORES }));
          mBoard = this.cacheService.get(`${season}-${year}-${month}`, 
            this.leaderboardRepo.findMonthBoardAndUpsert$(season, year, month, { status: BoardStatus.UPDATING_SCORES }));
          rBoard = this.cacheService.get(`${season}-${gameRound}`,
            this.leaderboardRepo.findRoundBoardAndUpsert$(season, gameRound, { status: BoardStatus.UPDATING_SCORES }));
        } else {
          sBoard = this.leaderboardRepo.findSeasonBoardAndUpsert$(season, { status: BoardStatus.UPDATING_SCORES });
          mBoard = this.leaderboardRepo.findMonthBoardAndUpsert$(season, year, month, {status: BoardStatus.UPDATING_SCORES});
          rBoard = this.leaderboardRepo.findRoundBoardAndUpsert$(season, gameRound, {status: BoardStatus.UPDATING_SCORES});
        }
        boards.push(sBoard, mBoard, rBoard);
        return Observable.forkJoin(boards)
          .flatMap(leaderboards => {
            return Observable.from(leaderboards)
          })
          .map(leaderboard => {
            return { user, fixture, leaderboard }
          })
      })
      .flatMap(data => {
        let { user, fixture, leaderboard } = data;
        return this.predictionRepo.findOne$({ userId: user.id, fixtureId: fixture.id })
          .map(prediction => {
            return { user, fixture, leaderboard, prediction }
          })
      })
      .concatMap(data => {
        let { user, fixture, leaderboard, prediction } = data;
        let userId = user.id
        let fixtureId = fixture.id
        let leaderboardId = leaderboard.id
        let predictionId = prediction.id
        let { scorePoints: points, hasJoker } = prediction;
        return this.userScoreRepo.findOneAndUpsert$(
          leaderboardId, userId, fixtureId, predictionId, points, hasJoker)
      })
      .count()
      .toPromise();
  }

  updateRankings(seasonId: string) {
    return this.leaderboardRepo.findAll$({ season: seasonId, status: BoardStatus.UPDATING_SCORES })
      .flatMap(leaderboards => {
        return Observable.from(leaderboards)
      })
      .flatMap(leaderboard => {
        return this.leaderboardRepo.findByIdAndUpdate$(leaderboard.id, { status: BoardStatus.UPDATING_RANKINGS })
      })
      .flatMap(leaderboard => {
        return this.userScoreRepo.findByLeaderboardOrderByPoints$(leaderboard.id)
          .flatMap(userScores => {
            return Observable.from(userScores);
          })
          .flatMap((standing, index) => {
            index += 1;
            let previousPosition = standing.positionNew || 0;
            let positionOld = previousPosition;
            let positionNew = index;
            return this.userScoreRepo.findByIdAndUpdate$(standing.id, { positionNew, positionOld })
              .map(_ => {
                return leaderboard.id;
              })
          })
      })
      .distinct()
      .count()
      .toPromise();
  }

  markLeaderboardsAsRefreshed(seasonId: string) {
    return this.leaderboardRepo.findAll$({season: seasonId, status: BoardStatus.UPDATING_RANKINGS})
    .flatMap(leaderboards => {
      return Observable.from(leaderboards)
    })
    .flatMap(leaderboard => {
      return this.leaderboardRepo.findByIdAndUpdate$(leaderboard.id, { status: BoardStatus.REFRESHED })
    })
    .count()
    .toPromise();
  }
}