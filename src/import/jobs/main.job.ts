import { FootballApiClient } from '../../thirdParty/footballApi/apiClient';
import { Queue } from '../queue';
import { IJob } from './job';

export class MainJob implements IJob {  
  start(queue: Queue) {
    throw new Error("Method not implemented.");
  }
}