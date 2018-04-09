import { Observable } from 'rxjs';

import { IFixtureRepository, FixtureRepository }  from '../../db/repositories/fixture.repo';
import { IUserRepository, UserRepository }  from '../../db/repositories/user.repo';
import { IPredictionRepository, PredictionRepository }  from '../../db/repositories/prediction.repo';
import { IPredictionCalculator, PredictionCalculator } from './prediction.calculator';

import { IFixture }  from '../../db/models/fixture.model';
import { IPrediction }  from '../../db/models/prediction.model';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface IPredictionProcessor {
  getPredictions$(fixture: IFixture): Observable<IPrediction[]>
  processPrediction$(prediction: IPrediction, fixture: IFixture): Observable<IPrediction>
}

export class PredictionProcessor implements IPredictionProcessor {
  static getInstance() {
    return new PredictionProcessor(
      FixtureRepository.getInstance(ApiProvider.LIGI),
      UserRepository.getInstance(),
      PredictionRepository.getInstance(),
      new PredictionCalculator());
  }
  constructor(
    private fixtureRepo: IFixtureRepository, 
    private userRepo: IUserRepository,
    private predictionRepo: IPredictionRepository,
    private predictionCalculator: IPredictionCalculator
    ) { }

  getPredictions$(fixture: IFixture) {
    let { season: seasonId, gameRound } = fixture;
    return this.fixtureRepo.findSelectableFixtures$(seasonId, gameRound)
      .map(selectableFixtures => {
        return [...selectableFixtures, fixture].map(n => n.id)
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
        let userId = data.user.id;
        return this.predictionRepo.findOrCreateJoker$(userId, seasonId, gameRound, selectableFixtureIds)
          .map(jokerPrediction => {
            return {
              userId, jokerPrediction
            }
          })
      })
      .flatMap(data => {
        let fixtureId = fixture.id;
        let { userId, jokerPrediction } = data;
        if(jokerPrediction.fixture === fixtureId) {
          return Observable.of(jokerPrediction)
        }
        return this.predictionRepo.findOneOrCreate$({userId, fixtureId})
      })
      .toArray()
  }

  processPrediction$(prediction: IPrediction, fixture: IFixture) {
    let { choice } = prediction;
    let { result } = fixture;
    let score = this.predictionCalculator.calculateScore(choice, result);
    return this.predictionRepo.findByIdAndUpdate$(prediction.id, { score })
  }
}