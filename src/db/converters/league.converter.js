"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const league_converter_1 = require("../converters/ligi/league.converter");
class LeagueConverterFactory {
    static makeLeagueConverter() {
        return new league_converter_1.LigiLeagueConverter();
    }
}
exports.LeagueConverterFactory = LeagueConverterFactory;
//# sourceMappingURL=league.converter.js.map