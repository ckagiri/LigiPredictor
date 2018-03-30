import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { ILeaderboard, ILeaderboardModel, LeaderboardModel } from '../models/leaderboard.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface ILeaderboardRepository extends IBaseRepository<ILeaderboard> {  
}

export class LeaderboardRepository extends BaseRepository<ILeaderboard> implements ILeaderboardRepository {
  static getInstance() {
    return new LeaderboardRepository();
  }

  constructor() {
    super(LeaderboardModel)
  }
}