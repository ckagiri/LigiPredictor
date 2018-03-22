import { Observable } from 'rxjs';

import { ILeague, LeagueModel } from '../models/league.model';
import { IBaseProviderRepository, BaseProviderRepository } from './baseProvider.repo';
import { ILeagueConverter, LeagueConverter } from '../converters/league.converter';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface ILeagueRepository extends IBaseProviderRepository<ILeague> {
  save$(league: ILeague): Observable<ILeague>
}

export class LeagueRepository extends BaseProviderRepository<ILeague> implements ILeagueRepository {
  static getInstance(provider: ApiProvider) {
    return new LeagueRepository(LeagueConverter.makeLeagueConverter(provider));
  }

  constructor(converter: ILeagueConverter) {
    super(LeagueModel, converter);
  }
}