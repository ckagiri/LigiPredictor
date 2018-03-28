import { Observable } from 'rxjs';
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
    let externalIdToSeasonMap = new Map<string|number, any>();
    let externalIds: Array<string|number> = [];
    for (let season of seasons) {
      externalIdToSeasonMap[season.id] = season;
      externalIds.push(season.id);      
    }
    return this.seasonRepo.getByExternalIds$(externalIds)
      .flatMap((dbSeasons) => {
        return Observable.from(dbSeasons);
      })
      .flatMap((dbSeason) => {
        let provider = this.seasonRepo.Converter.provider;
        let extId = dbSeason['externalReference'][provider]['id'];
        let extCurrentMatchRound = externalIdToSeasonMap[extId].currentMatchRound;
        
        if (dbSeason.currentMatchRound !== extCurrentMatchRound) {          
          let id = dbSeason['_id'];
          let update = { $set: {currentMatchRound: extCurrentMatchRound} };
          return this.seasonRepo.findByIdAndUpdate$(id, update);
        } else {          
          return Observable.of(dbSeason);
        }
      }).toPromise();
  }
}