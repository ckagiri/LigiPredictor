import { IFootballApiSchedulerFactory } from '../../footballApi';
import { SeasonScheduler } from './season.scheduler';

export class ApiFootballDataSchedulerFactory {
  static getInstance(): IFootballApiSchedulerFactory {
    return new ApiFootballDataSchedulerFactory();
  }

  makeSeasonScheduler() {
    return new SeasonScheduler();
  }
}