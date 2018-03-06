import { LeagueModel, ILeagueModel } from '../models/league.model';
import { BaseRepository } from './base.repo';

export class LeagueRepository extends BaseRepository<ILeagueModel> {
  static getInstance() {
    return new LeagueRepository();
  }

  constructor() {
    super(LeagueModel);
  }
}