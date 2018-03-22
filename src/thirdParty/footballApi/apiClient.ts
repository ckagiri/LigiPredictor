import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';
const ApiFootballDataClient = require('./apiFootballData/apiClient');

export interface IFootballApiClient {
  getCompetitions(year: number);
  getCompetition(competitionId: number|string);
  getTeams(competitionId: number|string);
}

export class FootballApiClient {
  static getInstance(provider: ApiProvider): IFootballApiClient {
    return ApiFootballDataClient.getInstance();
  }
}