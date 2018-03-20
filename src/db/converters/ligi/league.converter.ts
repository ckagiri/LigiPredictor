import { Observable } from 'rxjs';

import { ILeague } from '../../models/league.model';
import { ILeagueConverter } from '../league.converter';

export class LigiLeagueConverter implements ILeagueConverter {
  provider = 'LIGI';

  from(data: any): Observable<ILeague> {
    return Observable.of({
      name: data.name,
      code: data.code,
      slug: data.slug
    })
  }
}