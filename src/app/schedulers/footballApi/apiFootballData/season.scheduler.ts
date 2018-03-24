import { IFootballApiScheduler } from '../../footballApi';
import { SimpleScheduler } from '../../simple.scheduler';

export class SeasonScheduler extends SimpleScheduler implements IFootballApiScheduler {
  static getInstance() {
    return new SeasonScheduler();
  }

  constructor() {
    super()
    this.run = this.run.bind(this)
  }
  
  async run() {
    
  }


}