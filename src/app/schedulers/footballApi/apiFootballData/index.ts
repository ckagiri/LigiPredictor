import { IFootballApiSchedulers} from '../../footballApi';
import { FootballApiProvider as ApiProvider } from '../../../../common/footballApiProvider';
import { SeasonScheduler } from './season.scheduler';

export class ApiFootballDataSchedulers implements IFootballApiSchedulers {
  static getInstance() {
    return new ApiFootballDataSchedulers();
  }

  start() {
    SeasonScheduler.getInstance(ApiProvider.API_FOOTBALL_DATA).start();
  }
}