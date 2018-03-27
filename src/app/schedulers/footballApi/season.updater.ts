import { ISeasonRepository, SeasonRepository }  from '../../../db/repositories/season.repo'
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';

export interface ISeasonUpdater {
  updateCurrentMatchRound(seasons: any[]);
}

export class SeasonUpdater implements ISeasonUpdater {
  static getInstance(provider: ApiProvider) {
    return new SeasonUpdater(SeasonRepository.getInstance(provider));
  }

  constructor(private seasonRepo: ISeasonRepository) {
  }

  updateCurrentMatchRound(seasons: any[]) {
    let map = new Map<string|number, any>();
    let externalIds: Array<string|number> = [];
    for (let season of seasons) {
      map[season.id] = season;
      externalIds.push(season.id);      
    }
    return this.seasonRepo.getByExternalIds$(externalIds).toPromise();
  }
}