import { IJob } from '../jobs/job';
import { Queue } from '../queue';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';
import { IFootballApiClient } from '../../thirdParty/footballApi/apiClient';

export class CompetitionJob implements IJob {
  constructor(
    private competition: {id: number | string, caption?: string}, 
    private apiClient: IFootballApiClient) {   
  }

  start(queue: Queue) {
    throw new Error("Method not implemented.");
  }
}