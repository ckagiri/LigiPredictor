import { Observable } from 'rxjs';

import { IEntity } from '../models/base.model';
import { LigiLeagueConverter } from '../converters/ligi/league.converter';
import { IConverter } from './converter';
import { ILeague } from '../models/league.model';

export interface ILeagueConverter extends IConverter {
  from(data: any): Observable<ILeague>
}

export abstract class LeagueConverterFactory {
  static makeLeagueConverter() : ILeagueConverter {
    return new LigiLeagueConverter();
  }
}