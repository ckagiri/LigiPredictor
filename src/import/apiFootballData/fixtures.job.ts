import { IJob } from '../jobs/job';
import { Queue } from '../queue';

export class FixturesJob implements IJob {
  start(queue: Queue) {
    throw new Error("Method not implemented.");
  }
}