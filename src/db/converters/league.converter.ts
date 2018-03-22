import { Observable } from 'rxjs';

import { IEntity } from '../models/base.model';
import { LeagueConverter as LigiLeagueConverter } from '../converters/ligi/league.converter';
import { IConverter } from './converter';
import { ILeague } from '../models/league.model';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface ILeagueConverter extends IConverter {
  from(data: any): Observable<ILeague>
}

export abstract class LeagueConverter {
  static getInstance(provider: ApiProvider) : ILeagueConverter {
    switch(provider) {
      case ApiProvider.LIGI:
      case ApiProvider.API_FOOTBALL_DATA:
        return new LigiLeagueConverter();
      default: 
        throw new Error('Converter for Provider does not exist');
    }
  }
}