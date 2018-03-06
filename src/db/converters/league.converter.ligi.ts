import { Observable } from 'rxjs';

import { ILeague } from '../models/league.model';
import { IConverter } from './converter';

export class LigiLeagueConverter implements IConverter {
  convert(data: any): Observable<ILeague> {
    return Observable.of({
      name: data.name,
      code: data.code,
      slug: data.slug
    })
  }
}