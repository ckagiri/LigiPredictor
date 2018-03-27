import { Observable } from 'rxjs';

import { ITeam } from '../../models/team.model';
import { ITeamConverter } from '../team.converter';
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';

export class TeamConverter implements ITeamConverter {
  provider: ApiProvider;

  constructor() { this. provider = ApiProvider.API_FOOTBALL_DATA }
  
  from(data: any): Observable<ITeam> {
    return Observable.of({
      name: data.name,
      crestUrl: data.crestUrl,      
      externalReference: {
        [this.provider]: {
          id: data.id
        }
      }
     })
  }
}