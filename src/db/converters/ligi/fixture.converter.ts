import { Observable } from 'rxjs';

import { IFixture } from '../../models/fixture.model';
import { IFixtureConverter } from '../fixture.converter';
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';
import { ISeasonRepository, SeasonRepository } from '../../repositories/season.repo';
import { ITeamRepository, TeamRepository } from '../../repositories/team.repo';

export class FixtureConverter implements IFixtureConverter {
  provider: ApiProvider;

  static getInstance(): IFixtureConverter {
    return new FixtureConverter();
  }

  constructor() { this. provider = ApiProvider.API_FOOTBALL_DATA }
  
  from(data: any): Observable<IFixture> {
    return Observable.of({
      slug: data.slug
    })
  }

  map(data: any[]): any[] {
    return data;
  }
}