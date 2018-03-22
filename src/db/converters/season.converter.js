"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const season_converter_1 = require("../converters/ligi/season.converter");
const footballApiProvider_1 = require("../../common/footballApiProvider");
class SeasonConverter {
    static makeSeasonConverter(provider) {
        switch (provider) {
            case footballApiProvider_1.FootballApiProvider.LIGI:
                return new season_converter_1.LigiSeasonConverter();
            case footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA:
            default:
                throw new Error('Converter for Provider does not exist');
        }
    }
}
exports.SeasonConverter = SeasonConverter;
//# sourceMappingURL=season.converter.js.map