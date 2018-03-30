import { Observable } from 'rxjs';

import { } from '../../db/repositories/user.repo';
import { IFixtureRepository, FixtureRepository }  from '../../db/repositories/fixture.repo';
import { IUserRepository, UserRepository }  from '../../db/repositories/user.repo';
import { IPredictionRepository, PredictionRepository }  from '../../db/repositories/prediction.repo';

import { IFixture }  from '../../db/models/fixture.model';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface IPredictionProcessor {
  getPredictions(fixture: IFixture);
}

export class PredictionProcessor {
  static getInstance() {
    return new PredictionProcessor(
      FixtureRepository.getInstance(ApiProvider.LIGI),
      UserRepository.getInstance(),
      PredictionRepository.getInstance());
  }
  constructor(
    private fixtureRepo: IFixtureRepository, 
    private userRepo: IUserRepository,
    private predictionRepo: IPredictionRepository) {
  }

  getPredictions(fixture: IFixture) {
    let { season, gameRound } = fixture;
    return this.fixtureRepo.findSelectableFixtures$(season, gameRound)
      .map(selectableFixtures => {
        return [...selectableFixtures, fixture].map(n => n['_id'])
      })
      .flatMap(fixtureIds => {
        return this.userRepo.findAll$()  
          .flatMap(users => {
            return Observable.from(users)
          })      
          .map(user => {
            return {
              selectableFixtures: fixtureIds,
              user
            }
          })
      })
      .flatMap(data => {
        let { season, gameRound } = fixture;
        let selectableFixtures = data.selectableFixtures;
        let user = data.user['_id'];
        return this.predictionRepo.getOrCreateJoker$(user, season, gameRound, selectableFixtures)
      })
      .toArray()
      .toPromise();
  }
}



// getPredictions(fixture)

// getSelectableFixtures(seasoId, gameRound)  
// getOrCreateJokerPrediction(user, seasonId, gameRound, selectable:[])
// getOrCreatePrediction(user, fixture)
// processPrediction(prediction.choice, fixture.result)
// predictionCalculator.calculateScore
// updatePrediction(id, score)
