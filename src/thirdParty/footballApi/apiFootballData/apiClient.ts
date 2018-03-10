import * as request from 'request-promise';
const configPath = '../../../../src/config/environment/index'
import {Configurations}  from '../../../../src/config/environment/index';
let config: Configurations = require(configPath);

let API_KEY = config.API_FOOTBALL_DATA.apiKey;
let BASE_URL = "http://api.football-data.org/v1";

export class ApifootballDataClient {
  static getInstance() {
    return new ApifootballDataClient(API_KEY, BASE_URL);
  }

  constructor(private apiKey, private baseUrl) {
  }

  getCompetitions(year: number){
    let queryParams = year ? {year} : undefined;
		let apiResource = "/competitions";

    return request(this._getOptions(this.apiKey, '/competitions', queryParams))
      .then(this._mergeResponse);
  }

  _getOptions(apiKey: string, resource: string, queryParams: any) {
    queryParams = queryParams || {};    
      return {
        method: 'GET',
        url: BASE_URL + resource,
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