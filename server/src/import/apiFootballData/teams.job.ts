import { Observable } from 'rxjs';
import { IJob } from '../jobs/job';
import { Queue } from '../queue';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';
import { IFootballApiClient } from '../../thirdParty/footballApi/apiClient';
import { ITeamRepository } from '../../db/repositories/team.repo';

class Builder {
  private competitionId: number|string;  
  private apiClient: IFootballApiClient;
  private teamRepo: ITeamRepository;

  build() {
    return new TeamsJob(this);
  }

  get ApiClient() {
    return this.apiClient
  }

  setApiClient(value: IFootballApiClient) {
    this.apiClient = value;
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

  get CompetitionId() {
    return this.competitionId;
  }
}

export class TeamsJob implements IJob {
  private competitionId: number|string;  
  private apiClient: IFootballApiClient;
  private teamRepo: ITeamRepository;

  constructor(builder: Builder) { 
    this.apiClient = builder.ApiClient;
    this.teamRepo = builder.TeamRepo;
    this.competitionId = builder.CompetitionId;
  }

  static get Builder(): Builder {
    return new Builder();
  }

  start(queue: Queue) {
    console.log('** starting ApiFootballData Teams job')    
    return Observable.fromPromise(this.apiClient.getTeams(this.competitionId))
      .flatMap((teamsRes: any) => {
        let teams = teamsRes.data.teams;        
        return this.teamRepo.findEachByNameAndUpsert$(teams);
    }).toPromise();
  }
}