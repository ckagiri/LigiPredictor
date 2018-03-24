import { Observable } from 'rxjs';
import { IJob } from '../jobs/job';
import { Queue } from '../queue';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';
import { IFootballApiClient } from '../../thirdParty/footballApi/apiClient';
import { IFixtureRepository } from '../../db/repositories/fixture.repo';

class Builder {
  private competitionId: number|string;  
  private apiClient: IFootballApiClient;
  private fixtureRepo: IFixtureRepository;

  build() {
    return new FixturesJob(this);
  }

  get ApiClient() {
    return this.apiClient
  }

  setApiClient(value: IFootballApiClient) {
    this.apiClient = value;
    return this;
  }

  get FixtureRepo() {
    return this.fixtureRepo;
  }

  setFixtureRepo(value: IFixtureRepository): Builder {
    this.fixtureRepo = value;
    return this;
  }

  withCompetition(competitionId): Builder {
    this.competitionId = competitionId;
    return this;
  }

  get CompetitionId() {
    return this.competitionId;
  }
}

export class FixturesJob implements IJob {
  private competitionId: number|string;  
  private apiClient: IFootballApiClient;
  private fixtureRepo: IFixtureRepository;

  constructor(builder: Builder) { 
    this.apiClient = builder.ApiClient;
    this.fixtureRepo = builder.FixtureRepo;
    this.competitionId = builder.CompetitionId;
  }

  static get Builder(): Builder {
    return new Builder();
  }

  start(queue: Queue) {
    return Observable.fromPromise(this.apiClient.getFixtures(this.competitionId))
      .flatMap((fixturesRes: any) => {
        let fixtures = fixturesRes.data.fixtures;
        return this.fixtureRepo.findByExternalIdAndUpdate$(fixtures);
      }).toPromise();
  }
}