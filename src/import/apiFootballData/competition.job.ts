import { IJob } from '../jobs/job';
import { Queue } from '../queue';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';
import { IFootballApiClient } from '../../thirdParty/footballApi/apiClient';
import { ISeasonRepository } from '../../db/repositories/season.repo';
import { ITeamRepository } from '../../db/repositories/team.repo';

class Builder {
  private competitionId: number|string;  
  private apiClient: IFootballApiClient;
  private seasonRepo: ISeasonRepository;
  private teamRepo: ITeamRepository;
  constructor() {}
  build() {
     return new CompetitionJob(this);
  }

  get ApiClient() {
    return this.apiClient
  }

  setApiClient(value: IFootballApiClient) {
    this.apiClient = value;
    return this;
  }

  get SeasonRepo() {
    return this.seasonRepo;
  }

  setSeasonRepo(value: ISeasonRepository): Builder {
    this.seasonRepo = value;
    return this;
  }

  get TeamRepo() {
    return this.teamRepo;    
  }

  setTeamRepo(value: ITeamRepository): Builder {
    this.teamRepo = value;
    return this;
  }
  
  withCompetition(competitionId): Builder {
     this.competitionId = competitionId;
     return this;
  }
}

export class CompetitionJob implements IJob {
  private competitionId: number|string;  
  private apiClient: IFootballApiClient;
  private seasonRepo: ISeasonRepository;
  private teamRepo: ITeamRepository;

  constructor(builder: Builder) { 
    this.apiClient = builder.ApiClient;
    this.seasonRepo = builder.SeasonRepo;
    this.teamRepo = builder.TeamRepo;
  }

  static get Builder(): Builder {
    return new Builder();
  }

  start(queue: Queue) {
    throw new Error("Method not implemented.");
  }
}