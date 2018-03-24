import { Observable } from 'rxjs';

import { IFixture } from '../../models/fixture.model';
import { IFixtureConverter } from '../fixture.converter';
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';

export class FixtureConverter implements IFixtureConverter {
  provider: ApiProvider;

  constructor() { this. provider = ApiProvider.API_FOOTBALL_DATA }
  
  from(data: any): Observable<IFixture> {
    return Observable.of({
      name: data.name
     })
  }
}