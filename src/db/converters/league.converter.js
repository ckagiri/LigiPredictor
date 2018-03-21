"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const league_converter_1 = require("../converters/ligi/league.converter");
const footballApiProvider_1 = require("../../common/footballApiProvider");
class LeagueConverterFactory {
    static makeLeagueConverter(provider) {
        switch (provider) {
            case footballApiProvider_1.FootballApiProvider.LIGI:
                return new league_converter_1.LigiLeagueConverter();
            case footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA:
            default:
                throw new Error('Converter for Provider does not exist');
        }
    }
}
exports.LeagueConverterFactory = LeagueConverterFactory;
//# sourceMappingURL=league.converter.js.map