import { Observable } from 'rxjs';
import { IFixtureRepository, FixtureRepository }  from '../../../db/repositories/fixture.repo'
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';

export interface IFixturesUpdater {
  updateGameDetails(apiFixtures: any[]);
}

let fixtureChanged = (apiFixture: any, dbFixture: any) => {
  if (apiFixture.status !== dbFixture.status) {
    return true;
  }

  if (apiFixture.result.goalsHomeTeam !== dbFixture.result.goalsHomeTeam ||
    apiFixture.result.goalsAwayTeam !== dbFixture.result.goalsAwayTeam) {
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
          let { result, status } = apiFixture;
          return this.fixtureRepo.findByIdAndUpdate$(id, { result, status });
        }
        return Observable.of(dbFixture);
      }).toPromise();  }
}