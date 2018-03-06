import { ILeague, LeagueModel, ILeagueModel } from '../models/league.model';
import { IBaseRepository, BaseRepository } from './base.repo';
import { Observable } from 'rxjs';

export interface ILeagueRepository extends IBaseRepository<ILeagueModel> {
  save$(league: ILeague): Observable<ILeagueModel>
}

export class LeagueRepository extends BaseRepository<ILeagueModel> implements ILeagueRepository {
  static getInstance() {
    return new LeagueRepository();
  }

  constructor() {
    super(LeagueModel);
  }
}