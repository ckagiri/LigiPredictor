import { Observable } from 'rxjs';

import { IEntity } from '../models/base.model';
import { FixtureConverter as LigiFixtureConverter } from '../converters/ligi/fixture.converter';
import { FixtureConverter as AfdFixtureConverter } from '../converters/apiFootballData/fixture.converter';
import { IConverter } from './converter';
import { IFixture } from '../models/fixture.model';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface IFixtureConverter extends IConverter {
  from(data: any): Observable<IFixture>
}

export abstract class FixtureConverter {
  static getInstance(provider: ApiProvider) : IFixtureConverter {
    switch(provider) {
      case ApiProvider.LIGI:
        return LigiFixtureConverter.getInstance();
      case ApiProvider.API_FOOTBALL_DATA:
        return AfdFixtureConverter.getInstance();
      default: 
        throw new Error('Converter for Provider does not exist');
    }
  }
}