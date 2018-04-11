import { Observable } from 'rxjs';

import { IPrediction, PredictionStatus }  from '../../db/models/prediction.model';
import { IFixture, FixtureStatus }  from '../../db/models/fixture.model';
import { IPredictionProcessor, PredictionProcessor } from './prediction.processor';
import { IFixtureRepository, FixtureRepository } from '../../db/repositories/fixture.repo';

export interface IFinishedFixturesProcessor {
  processPredictions(fixtures: any[])
  setToTrueAllPredictionsProcessed(fixtures: any[])
}

export class FinishedFixturesProcessor implements IFinishedFixturesProcessor {
  static getInstance() {
    return new FinishedFixturesProcessor(PredictionProcessor.getInstance(), FixtureRepository.getInstance())
  }

  constructor(private predictionProcessor: IPredictionProcessor, private fixtureRepo: IFixtureRepository) {
  }

  processPredictions(fixtures: IFixture[]) {
    return Observable.from(fixtures)
      .filter(fixture => {
        return fixture.status === FixtureStatus.FINISHED  && fixture.allPredictionsProcessed === false;
      })
      .concatMap(fixture => {
        return this.predictionProcessor.getPredictions$(fixture)
          .flatMap(predictions => {
            return Observable.from(predictions)
          })
          .map(prediction => {
            return { fixture, prediction }
          })
      })
      .filter(data => {
        return data.prediction.status !== PredictionStatus.PROCESSED
      })
      .flatMap(data => {
        let { fixture, prediction } = data;
        return this.predictionProcessor.processPrediction$(prediction, fixture)
      })
      .count()
      .toPromise();
  }

  setToTrueAllPredictionsProcessed(fixtures: any[]) {
    return Observable.from(fixtures)
    .filter(fixture => {
      return fixture.status === FixtureStatus.FINISHED  && fixture.allPredictionsProcessed === false;
    })
    .flatMap(fixture => {
      return this.fixtureRepo.findByIdAndUpdate$(fixture.id, { allPredictionsProcessed: true });
    })
    .count()
    .toPromise();
  }  
}

