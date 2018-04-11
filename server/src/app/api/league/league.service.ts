import { Observable } from 'rxjs';
import { ILeague } from '../../../db/models/league.model';
import { ISeason } from '../../../db/models/season.model';

import { ILeagueRepository, LeagueRepository } from '../../../db/repositories/league.repo';
import { ISeasonRepository, SeasonRepository } from '../../../db/repositories/season.repo';

import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';
import isMongoId from '../../utils/isMongoId'

export interface ILeagueService {
  getAllLeagues$(): Observable<ILeague[]>;
  getLeagueById$(id: string): Observable<ILeague>;
  getAllSeasonsByLeague$(leagueId: string): Observable<ISeason[]>;
}

export class LeagueService implements ILeagueService {
  static getInstance(provider: ApiProvider = ApiProvider.LIGI): ILeagueService {
    return new LeagueService(
      LeagueRepository.getInstance(provider),
      SeasonRepository.getInstance(provider));
  }

  constructor(
    private leagueRepo: ILeagueRepository,
    private seasonRepo: ISeasonRepository) { }

  getAllLeagues$() {
    return this.leagueRepo.findAll$();
  }

  getLeagueById$(id: string) {
    if (isMongoId(id)) {
      return this.leagueRepo.findById$(id);
    } else {
      return this.leagueRepo.findOne$({ slug: id });
    }
  }

  getAllSeasonsByLeague$(leagueId: string) {
    return this.seasonRepo.findAll$({ league: leagueId })
  }
}