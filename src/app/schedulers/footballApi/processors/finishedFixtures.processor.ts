export interface IFinishedFixturesProcessor {
  processFixtures(fixtures: any[])
}

export class FinishedFixturesProcessor implements IFinishedFixturesProcessor {
  static getInstance() {
    return new FinishedFixturesProcessor()
  }

  processFixtures(fixtures: any[]) {
    throw new Error("Method not implemented.");
  }
}