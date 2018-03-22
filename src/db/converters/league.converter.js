"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const league_converter_1 = require("../converters/ligi/league.converter");
const footballApiProvider_1 = require("../../common/footballApiProvider");
class LeagueConverter {
    static makeLeagueConverter(provider) {
        switch (provider) {
            case footballApiProvider_1.FootballApiProvider.LIGI:
            case footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA:
                return new league_converter_1.LeagueConverter();
            default:
                throw new Error('Converter for Provider does not exist');
        }
    }
}
exports.LeagueConverter = LeagueConverter;
//# sourceMappingURL=league.converter.js.map