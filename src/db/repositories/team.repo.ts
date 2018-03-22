import { Observable } from 'rxjs';

import { ITeam, TeamModel } from '../models/team.model';
import { IBaseProviderRepository, BaseProviderRepository } from './baseProvider.repo';
import { ITeamConverter, TeamConverter } from '../converters/team.converter';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface ITeamRepository extends IBaseProviderRepository<ITeam> {
  save$(team: ITeam): Observable<ITeam>
}

export class TeamRepository extends BaseProviderRepository<ITeam> implements ITeamRepository {
  static getInstance(provider: ApiProvider) {
    return new TeamRepository(TeamConverter.makeTeamConverter(provider));
  }

  constructor(converter: ITeamConverter) {
    super(TeamModel, converter);
  }
}