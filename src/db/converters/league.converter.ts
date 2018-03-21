import { Observable } from 'rxjs';

import { IEntity } from '../models/base.model';
import { LigiLeagueConverter } from '../converters/ligi/league.converter';
import { IConverter } from './converter';
import { ILeague } from '../models/league.model';
import { ApiProvider } from '../../common/apiProvider';

export interface ILeagueConverter extends IConverter {
  from(data: any): Observable<ILeague>
}

export abstract class LeagueConverterFactory {
  static makeLeagueConverter(provider: ApiProvider) : ILeagueConverter {
    switch(provider) {
      case ApiProvider.LIGI:
        return new LigiLeagueConverter();
      case ApiProvider.API_FOOTBALL_DATA:
      default: 
        throw new Error('Converter for Provider does not exist');
    }
  }
}