import { Observable } from 'rxjs';

import { ILeague, LeagueModel, ILeagueModel } from '../models/league.model';
import { IBaseProviderRepository, BaseProviderRepository } from './baseProvider.repo';
import { ILeagueConverter } from '../converters/league.converter';
import { LeagueConverterFactory } from '../converters/league.converter'
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface ILeagueRepository extends IBaseProviderRepository<ILeagueModel> {
  save$(league: ILeague): Observable<ILeagueModel>
}

export class LeagueRepository extends BaseProviderRepository<ILeagueModel> implements ILeagueRepository {
  static getInstance(provider: ApiProvider) {
    return new LeagueRepository(LeagueConverterFactory.makeLeagueConverter(provider));
  }

  constructor(converter: ILeagueConverter) {
    super(LeagueModel, converter);
  }
}