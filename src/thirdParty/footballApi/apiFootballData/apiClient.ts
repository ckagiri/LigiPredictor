let request = require('request-promise');
const configPath = '../../../../src/config/environment/index'
import {Configurations}  from '../../../../src/config/environment/index';
import { IFootballApiClient } from '../apiClient';

let config: Configurations = require(configPath);

let API_KEY = config.API_FOOTBALL_DATA.apiKey;
let BASE_URL = "http://api.football-data.org/v1";

module.exports = {
  getInstance: () => { return new ApiFootballDataClient(API_KEY, BASE_URL) }
}

class ApiFootballDataClient implements IFootballApiClient {
  constructor(private apiKey, private baseUrl) {
  }

  getCompetitions(year: number){
    let queryParams = year ? {year} : undefined;
		let apiResource = '/competitions';

    return request(this._getOptions(this.apiKey, apiResource, queryParams))
      .then(this._mergeResponse);
  }

  getCompetition(competitionId: number|string) {
		let apiResource = `/competitions/${competitionId}`;

    return request(this._getOptions(this.apiKey, apiResource))
      .then(this._mergeResponse);
  }

  getTeams(competitionId: number|string) {
    let apiResource = `/competitions/${competitionId}/teams`;
    return request(this._getOptions(this.apiKey, apiResource))
      .then(this._mergeResponse);  
  }

  _getOptions(apiKey: string, resource: string, queryParams?: any) {
    queryParams = queryParams || {};    
      return {
        //method: 'GET',
        uri: BASE_URL + resource,
        headers: {
          'X-Auth-Token': apiKey,
          'X-Response-Control': "minified"
        },
        resolveWithFullResponse: true,
        qs: queryParams
      }
  }

  _mergeResponse(response: any) {
    return {
      data: JSON.parse(response.body),
      metadata: {
        requestCount: response.headers['x-requests-available'],
        requestCountReset: response.headers['x-requestcounter-reset']
      }
	  } 
  } 
}