import { Observable } from 'rxjs';
import { ISeasonRepository, SeasonRepository }  from '../../../db/repositories/season.repo'
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';

export interface ISeasonUpdater {
  updateCurrentMatchRound(apiSeasons: any[]);
}

export class SeasonUpdater implements ISeasonUpdater {
  static getInstance(provider: ApiProvider) {
    return new SeasonUpdater(SeasonRepository.getInstance(provider));
  }

  constructor(private seasonRepo: ISeasonRepository) {
  }

  updateCurrentMatchRound(apiSeasons: any[]) {
    let externalIdToApiSeasonMap = new Map<string, any>();
    let externalIds: Array<string> = [];
    for (let apiSeason of apiSeasons) {
      externalIdToApiSeasonMap[apiSeason.id] = apiSeason;
      externalIds.push(apiSeason.id);      
    }
    return this.seasonRepo.findByExternalIds$(externalIds)
      .flatMap((dbSeasons) => {
        return Observable.from(dbSeasons);
      })
      .flatMap((dbSeason) => {
        let provider = this.seasonRepo.Provider;
        let extId = dbSeason['externalReference'][provider]['id'];
        let extCurrentMatchRound = externalIdToApiSeasonMap[extId].currentMatchRound;
        
        if (dbSeason.currentMatchRound !== extCurrentMatchRound) {          
          let id = dbSeason.id;
          let update = { currentMatchRound: extCurrentMatchRound };
          return this.seasonRepo.findByIdAndUpdate$(id, update);
        } else {          
          return Observable.of(dbSeason);
        }
      }).toPromise();
  }
}