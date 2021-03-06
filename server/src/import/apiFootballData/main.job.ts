import { Queue } from '../queue';
import { IJob } from '../jobs/job';
import { CompetitionJob } from './competition.job';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';
import { FootballApiClient, IFootballApiClient } from '../../thirdParty/footballApi/apiClient';
import { ISeasonRepository, SeasonRepository } from '../../db/repositories/season.repo';
import { ITeamRepository, TeamRepository } from '../../db/repositories/team.repo';
import { IFixtureRepository, FixtureRepository } from '../../db/repositories/fixture.repo';

export class MainJob implements IJob {  
  static getInstance() {
    return new MainJob(
      FootballApiClient.getInstance(ApiProvider.API_FOOTBALL_DATA),
      SeasonRepository.getInstance(ApiProvider.API_FOOTBALL_DATA),
      TeamRepository.getInstance(ApiProvider.API_FOOTBALL_DATA),
      FixtureRepository.getInstance(ApiProvider.API_FOOTBALL_DATA),
    );
  }

  constructor(
    private apiClient: IFootballApiClient,
    private seasonRepo: ISeasonRepository,
    private teamRepo: ITeamRepository,
    private fixtureRepo: IFixtureRepository) {   
  }
  
  start(queue: Queue) {
    console.log('** starting ApiFootballData Main job')    
    return this.apiClient.getCompetitions(2017).then(({data: competitions}) => {
      for (let comp of competitions) {
         if (comp.id !== 445) {
          continue;
        }  
        let competition = {id: comp.id, caption: comp.caption}
        let jobBuilder = CompetitionJob.Builder;
        let job = jobBuilder
          .setApiClient(this.apiClient)
          .setSeasonRepo(this.seasonRepo)
          .setTeamRepo(this.teamRepo)
          .setFixtureRepo(this.fixtureRepo)
          .withCompetition(comp.id)
          .build();
        queue.addJob(job);
      }
    }).catch((err: any) => {
      let message = err.message || 'Something went wrong!'
      throw new Error(err)
    });
  }
}