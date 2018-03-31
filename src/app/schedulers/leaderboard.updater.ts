import { Observable } from 'rxjs';

import { IFixture, FixtureStatus }  from '../../db/models/fixture.model';
import { IUserRepository, UserRepository }  from '../../db/repositories/user.repo';

export interface ILeaderboardUpdater {
  updateScores(fixtures: IFixture[])
  updateRankigs()
}

export class LeaderboardUpdater implements ILeaderboardUpdater {
  static getInstance() {
    UserRepository.getInstance()
  }
  
  constructor(
    private userRepo: IUserRepository
  ) { }

  updateScores(fixtures: IFixture[]) {
    return Observable.from(fixtures)
      .filter(fixture => {
        return fixture.status === FixtureStatus.FINISHED  && fixture.allPredictionsProcessed === false;
      })
      .flatMap(fixture => {
        return this.userRepo.findAll$()
          .map(user => {
            return { user, fixture }
          })
      })
      .toPromise();
    // fe fixtures
    // fe user
    // fe lbs
    // fe pred
    // fe score
  }

  updateRankigs() {
    throw new Error("Method not implemented.");
  }
}