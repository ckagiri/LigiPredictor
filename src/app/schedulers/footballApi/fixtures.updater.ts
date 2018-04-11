import { Observable } from 'rxjs';
import { IFixture }  from '../../../db/models/fixture.model'
import { IFixtureRepository, FixtureRepository }  from '../../../db/repositories/fixture.repo'
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';
import { Odds } from '../../../common/score';

export interface IFixturesUpdater {
  updateGameDetails(apiFixtures: any[]);
}

let fixtureChanged = (apiFixture: any, dbFixture: IFixture) => {
  if (apiFixture.status !== dbFixture.status) {
    return true;
  }

  if (apiFixture.result.goalsHomeTeam !== dbFixture.result.goalsHomeTeam ||
      apiFixture.result.goalsAwayTeam !== dbFixture.result.goalsAwayTeam) {
    return true;
  }


  if((apiFixture.odds && apiFixture.odds.homeWin) !== dbFixture.odds.homeWin || 
     (apiFixture.odds && apiFixture.odds.awayWin) !== dbFixture.odds.awayWin || 
     (apiFixture.odds && apiFixture.odds.draw) !== dbFixture.odds.draw) {
    return true;
  }
    
  return false;
}

export class FixturesUpdater implements IFixturesUpdater {
  static getInstance(provider: ApiProvider) {
    return new FixturesUpdater(FixtureRepository.getInstance(provider));
  }

  constructor(private fixtureRepo: IFixtureRepository) {
  }

  updateGameDetails(apiFixtures: any[]) {
    let externalIdToApiFixtureMap = new Map<string, any>();
    let externalIds: Array<string> = [];
    for (let apiFixture of apiFixtures) {
      externalIdToApiFixtureMap[apiFixture.id] = apiFixture;
      externalIds.push(apiFixture.id);      
    }
    return this.fixtureRepo.findByExternalIds$(externalIds)
      .flatMap((dbFixtures) => {
        return Observable.from(dbFixtures);
      })
      .flatMap((dbFixture) => {
        let provider = this.fixtureRepo.Provider;
        let extId = dbFixture['externalReference'][provider]['id'];
        let apiFixture = externalIdToApiFixtureMap[extId];
        
        if (fixtureChanged(apiFixture, dbFixture)) {
          let id = dbFixture.id;
          let { result, status, odds } = apiFixture;
          let update = { result: result, status, odds: odds }
          Object.keys(update).forEach(key => update[key] == null && delete update[key])
          return this.fixtureRepo.findByIdAndUpdate$(id, update);
        }
        return Observable.of(dbFixture);
      }).toPromise();  }
}