export interface IFinishedFixturesProcessor {
  processPredictions(fixtures: any[])
}

export class FinishedFixturesProcessor implements IFinishedFixturesProcessor {
  static getInstance() {
    return new FinishedFixturesProcessor()
  }

  processPredictions(fixtures: any[]) {
 
  }
}

