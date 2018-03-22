import { Observable } from 'rxjs';

import { IEntity } from '../models/base.model';
import { LigiTeamConverter } from '../converters/ligi/team.converter';
import { IConverter } from './converter';
import { ITeam } from '../models/team.model';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface ITeamConverter extends IConverter {
  from(data: any): Observable<ITeam>
}

export abstract class TeamConverter {
  static makeTeamConverter(provider: ApiProvider) : ITeamConverter {
    switch(provider) {
      case ApiProvider.LIGI:
        return new LigiTeamConverter();
      case ApiProvider.API_FOOTBALL_DATA:
      default: 
        throw new Error('Converter for Provider does not exist');
    }
  }
}