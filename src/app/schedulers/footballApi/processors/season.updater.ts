import { ISeasonRepository, SeasonRepository }  from '../../../../db/repositories/season.repo'
import { FootballApiProvider as ApiProvider } from '../../../../common/footballApiProvider';

export interface ISeasonUpdater {
  updateSeasons(seasons: any[]);
}

export class SeasonUpdater implements ISeasonUpdater {
  static getInstance(provider: ApiProvider) {
    return new SeasonUpdater(SeasonRepository.getInstance(provider));
  }

  constructor(private seasonRepo: ISeasonRepository) {
  }

  updateSeasons(seasons: any[]) {
    throw new Error("Method not implemented.");
  }
}