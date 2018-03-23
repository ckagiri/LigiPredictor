import { IFootballApiSchedulers} from '../../footballApi';
import { SeasonScheduler } from './season.scheduler';

export class ApiFootballDataSchedulers implements IFootballApiSchedulers {
  static getInstance() {
    return new ApiFootballDataSchedulers();
  }

  run() {
    SeasonScheduler.getInstance().run();
  }
}