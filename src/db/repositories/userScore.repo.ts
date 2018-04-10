import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { ScorePoints } from '../../common/score';
import { IUserScore, IUserScoreModel, UserScoreModel } from '../models/userScore.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface IUserScoreRepository extends IBaseRepository<IUserScore> { 
  findOneAndUpsert$(leaderboardId: string, userId: string, fixtureId: string, predictionId: string, 
    points: ScorePoints, hasJoker: boolean): Observable<IUserScore>;
  findByLeaderboardOrderByPoints$(leaderboardId: string): Observable<IUserScore[]>;
}

export class UserScoreRepository extends BaseRepository<IUserScore> implements IUserScoreRepository {
  static getInstance() {
    return new UserScoreRepository();
  }

  constructor() {
    super(UserScoreModel)
  }

  findOneAndUpsert$(leaderboardId: string, userId: string, fixtureId: string, predictionId: string, 
    points: ScorePoints, hasJoker: boolean) {
      return Observable.of(<IUserScore>{});
  }

  findByLeaderboardOrderByPoints$(leaderboardId: string) {
    return Observable.of([<IUserScore>{}]);
  }
}