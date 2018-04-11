import { IScheduler } from '../schedulers';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';
import { SeasonScheduler } from './footballApi/season.scheduler';

export class FootballApiSchedulers implements IScheduler {
  static getInstance() {
    return new FootballApiSchedulers();
  }

  start() {
    SeasonScheduler.getInstance(ApiProvider.API_FOOTBALL_DATA).start();
  }
}