"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiFootballDataClient = require('./apiFootballData/apiClient');
class FootballApiClient {
    static getInstance(provider) {
        return ApiFootballDataClient.getInstance();
    }
}
exports.FootballApiClient = FootballApiClient;
//# sourceMappingURL=apiClient.js.map