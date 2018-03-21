"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const league_converter_1 = require("../converters/ligi/league.converter");
const apiProvider_1 = require("../../common/apiProvider");
class LeagueConverterFactory {
    static makeLeagueConverter(provider) {
        switch (provider) {
            case apiProvider_1.ApiProvider.LIGI:
                return new league_converter_1.LigiLeagueConverter();
            case apiProvider_1.ApiProvider.API_FOOTBALL_DATA:
            default:
                throw new Error('Converter for Provider does not exist');
        }
    }
}
exports.LeagueConverterFactory = LeagueConverterFactory;
//# sourceMappingURL=league.converter.js.map