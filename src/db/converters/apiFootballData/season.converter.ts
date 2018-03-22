import { Observable } from 'rxjs';

import { ISeason } from '../../models/season.model';
import { ISeasonConverter } from '../season.converter';
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';

export class SeasonConverter implements ISeasonConverter {
  provider: ApiProvider;

  constructor() { this. provider = ApiProvider.API_FOOTBALL_DATA }
  
  from(data: any): Observable<ISeason> {
    return Observable.of({
      name: data.caption,
      year: data.year,
      currentMatchRound: data.currentMatchday,
      externalReference: {
        [this.provider.toString()]: {
          id: data.id
        }
      }
    })
  }
}