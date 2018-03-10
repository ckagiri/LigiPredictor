"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const configPath = '../../../../src/config/environment/index';
let config = require(configPath);
let API_KEY = config.API_FOOTBALL_DATA.apiKey;
let BASE_URL = "http://api.football-data.org/v1";
class ApifootballDataClient {
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }
    static getInstance() {
        return new ApifootballDataClient(API_KEY, BASE_URL);
    }
    getCompetitions(year) {
        let queryParams = year ? { year } : undefined;
        let apiResource = "/competitions";
        return request(this._getOptions(this.apiKey, '/competitions', queryParams))
            .then(this._mergeResponse);
    }
    _getOptions(apiKey, resource, queryParams) {
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
        };
    }
    _mergeResponse(response) {
        return {
            data: JSON.parse(response.body),
            metadata: {
                requestCount: response.headers['x-requests-available'],
                requestCountReset: response.headers['x-requestcounter-reset']
            }
        };
    }
}
exports.ApifootballDataClient = ApifootballDataClient;
//# sourceMappingURL=apiClient.js.map