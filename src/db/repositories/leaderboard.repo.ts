import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { ILeaderboard, ILeaderboardModel, LeaderboardModel } from '../models/leaderboard.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface ILeaderboardRepository extends IBaseRepository<ILeaderboard> {  
  findSeasonBoardAndUpdate$(seasonId: string, update: any);
  findMonthBoardAndUpdate$(seasonId: string, year: number, month: number, update: any);
  findRoundBoardAndUpdate$(seasonId: string, gameRound: number, update: any);
}

export class LeaderboardRepository extends BaseRepository<ILeaderboard> implements ILeaderboardRepository {
  static getInstance() {
    return new LeaderboardRepository();
  }

  constructor() {
    super(LeaderboardModel)
  }

  findSeasonBoardAndUpdate$(seasonId: string, update: any) {
    return Observable.of(<ILeaderboard>{})    
  }  

  findMonthBoardAndUpdate$(seasonId: string, year: number, month: number, update: any) {
    return Observable.of(<ILeaderboard>{})    
  }

  findRoundBoardAndUpdate$(seasonId: string, gameRound: number, update: any) {
    return Observable.of(<ILeaderboard>{})    
  }
}