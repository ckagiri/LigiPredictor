import { Observable } from 'rxjs';

import { ISeason, SeasonModel } from '../models/season.model';
import { IBaseProviderRepository, BaseProviderRepository } from './baseProvider.repo';
import { ISeasonConverter, SeasonConverter } from '../converters/season.converter';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface ISeasonRepository extends IBaseProviderRepository<ISeason> {
}

export class SeasonRepository extends BaseProviderRepository<ISeason> implements ISeasonRepository {
  static getInstance(provider: ApiProvider) {
    return new SeasonRepository(SeasonConverter.makeSeasonConverter(provider));
  }

  constructor(converter: ISeasonConverter) {
    super(SeasonModel, converter);
  }
}