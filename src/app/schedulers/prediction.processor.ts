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
    let { season: seasonId, gameRound } = fixture;
    return this.fixtureRepo.findSelectableFixtures$(seasonId, gameRound)
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
              selectableFixtureIds: fixtureIds,
              user
            }
          })
      })
      .flatMap(data => {
        let { season: seasonId, gameRound } = fixture;
        let selectableFixtureIds = data.selectableFixtureIds;
        let userId = data.user['_id'];
        return this.predictionRepo.getOrCreateJoker$(userId, seasonId, gameRound, selectableFixtureIds)
          .map(jokerPrediction => {
            return {
              userId, jokerPrediction
            }
          })
      })
      .flatMap(data => {
        let fixtureId = fixture['_id'];
        let { userId, jokerPrediction } = data;

        if(jokerPrediction.fixture === fixtureId) {
          return Observable.of({
            userId, prediction: jokerPrediction
          })
        }
        return this.predictionRepo.findOneOrCreate$(userId, fixtureId)
          .map(prediction => {
            return {
              userId, prediction
            }
          })
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
