import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';
const ApiFootballDataClient = require('./apiFootballData/apiClient');

export interface IFootballApiClient {
  getCompetitions(year: number);
}

export class FootballApiClient {
  static getInstance(provider: ApiProvider): IFootballApiClient {
    return ApiFootballDataClient.getInstance();
  }
}