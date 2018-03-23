import { IFootballApiScheduler } from '../../footballApi';
import { SimpleScheduler } from '../../simple.scheduler';

export class SeasonScheduler extends SimpleScheduler implements IFootballApiScheduler {
  static getInstance() {
    return new SeasonScheduler();
  }
  
  run() {
    throw new Error("Method not implemented.");
  }
}