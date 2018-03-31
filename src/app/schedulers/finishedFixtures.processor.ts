import { Observable } from 'rxjs';

import { IPrediction, PredictionStatus }  from '../../db/models/prediction.model';
import { IFixture, FixtureStatus }  from '../../db/models/fixture.model';
import { IPredictionProcessor, PredictionProcessor } from './prediction.processor';

export interface IFinishedFixturesProcessor {
  processPredictions(fixtures: any[])
}

export class FinishedFixturesProcessor implements IFinishedFixturesProcessor {
  static getInstance() {
    return new FinishedFixturesProcessor(PredictionProcessor.getInstance())
  }

  constructor(private predictionProcessor: IPredictionProcessor) {
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
}

