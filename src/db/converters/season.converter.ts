import { Observable } from 'rxjs';

import { IEntity } from '../models/base.model';
import { LigiSeasonConverter } from '../converters/ligi/season.converter';
import { IConverter } from './converter';
import { ISeason } from '../models/season.model';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface ISeasonConverter extends IConverter {
  from(data: any): Observable<ISeason>
}

export abstract class SeasonConverter {
  static makeSeasonConverter(provider: ApiProvider) : ISeasonConverter {
    switch(provider) {
      case ApiProvider.LIGI:
        return new LigiSeasonConverter();
      case ApiProvider.API_FOOTBALL_DATA:
      default: 
        throw new Error('Converter for Provider does not exist');
    }
  }
}