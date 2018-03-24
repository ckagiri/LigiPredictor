import { Observable } from 'rxjs';

import { ITeam, TeamModel } from '../models/team.model';
import { IBaseProviderRepository, BaseProviderRepository } from './baseProvider.repo';
import { ITeamConverter, TeamConverter } from '../converters/team.converter';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface ITeamRepository extends IBaseProviderRepository<ITeam> {
  findByNameAndUpdate$(teams: ITeam[]): Observable<ITeam[]>;
  getByName$(name: string): Observable<ITeam>;
}

export class TeamRepository extends BaseProviderRepository<ITeam> implements ITeamRepository {
  static getInstance(provider: ApiProvider): ITeamRepository {
    return new TeamRepository(TeamConverter.getInstance(provider));
  }

  constructor(converter: ITeamConverter) {
    super(TeamModel, converter);
  }

  findByNameAndUpdate$(teams: ITeam[]): Observable<ITeam[]> {
    return Observable.of([<ITeam>{}])
  }  

  getByName$(name: string): Observable<ITeam> {
    return Observable.of(<ITeam>{})
  }  
}