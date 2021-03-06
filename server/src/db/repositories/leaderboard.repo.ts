import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { ILeaderboard, ILeaderboardModel, LeaderboardModel, BoardType } from '../models/leaderboard.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface ILeaderboardRepository extends IBaseRepository<ILeaderboard> {  
  findSeasonBoardAndUpsert$(seasonId: string, update: any): Observable<ILeaderboard>
  findMonthBoardAndUpsert$(seasonId: string, year: number, month: number, update: any): Observable<ILeaderboard>
  findRoundBoardAndUpsert$(seasonId: string, gameRound: number, update: any): Observable<ILeaderboard>
}

export class LeaderboardRepository extends BaseRepository<ILeaderboard> implements ILeaderboardRepository {
  static getInstance() {
    return new LeaderboardRepository();
  }

  constructor() {
    super(LeaderboardModel)
  }

  findSeasonBoardAndUpsert$(seasonId: string, update: any) {
		let query: any = { season: seasonId, boardType: BoardType.GLOBAL_SEASON };
    return this.findOneAndUpdate$(query, update, { upsert: true, new: true });
  }  

  findMonthBoardAndUpsert$(seasonId: string, year: number, month: number, update: any) {
		let query: any = { season: seasonId, year, month, boardType: BoardType.GLOBAL_MONTH };
    return this.findOneAndUpdate$(query, update, { upsert: true, new: true });
  }

  findRoundBoardAndUpsert$(seasonId: string, gameRound: number, update: any) {
		let query: any = { season: seasonId, gameRound, boardType: BoardType.GLOBAL_ROUND };
    return this.findOneAndUpdate$(query, update, { upsert: true, new: true });
  }
}