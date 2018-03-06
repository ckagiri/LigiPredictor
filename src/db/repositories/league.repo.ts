import { LeagueModel, ILeagueModel } from '../models/league.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface ILeagueRepository extends IBaseRepository<ILeagueModel> {
}

export class LeagueRepository extends BaseRepository<ILeagueModel> implements ILeagueRepository {
  static getInstance() {
    return new LeagueRepository();
  }

  constructor() {
    super(LeagueModel);
  }
}