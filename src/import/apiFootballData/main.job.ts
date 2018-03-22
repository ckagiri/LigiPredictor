import { FootballApiClient, IFootballApiClient } from '../../thirdParty/footballApi/apiClient';
import { Queue } from '../queue';
import { IJob } from '../jobs/job';
import { CompetitionJob } from './competition.job';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export class MainJob implements IJob {  
  static getInstance() {
    return new MainJob(FootballApiClient.getInstance(ApiProvider.API_FOOTBALL_DATA));
  }

  constructor(private apiClient: IFootballApiClient) {   
  }
  
  start(queue: Queue) {
    return this.apiClient.getCompetitions(2017).then(({data: competitions}) => {
      for (let comp of competitions) {
         if (comp.id !== 445) {
          continue;
        }  
        let competition = {id: comp.id, caption: comp.caption}
        let job = new CompetitionJob(competition, this.apiClient);             
        queue.addJob(job);
      }
    }).catch((err: any) => {
      let message = err.message || 'Something went wrong!'
      throw new Error(err)
    });
  }
}