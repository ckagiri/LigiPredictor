import { Observable } from 'rxjs';

import { ITeam } from '../../models/team.model';
import { ITeamConverter } from '../team.converter';
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';

export class TeamConverter implements ITeamConverter {
  provider: ApiProvider;

  static getInstance(): ITeamConverter {
    return new TeamConverter();
  }

  constructor() { this. provider = ApiProvider.API_FOOTBALL_DATA }
  
  from(data: any): Observable<ITeam> {
    return Observable.of({
      name: data.name,
      shortName: data.shortName,
      code: data.code,
      slug: data.slug,
      aliases: data.aliases
     })
  }
}