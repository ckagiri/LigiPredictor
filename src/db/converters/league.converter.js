"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const league_converter_ligi_1 = require("../converters/league.converter.ligi");
class LeagueConverter {
    static getInstance() {
        return new league_converter_ligi_1.LigiLeagueConverter();
    }
}
exports.LeagueConverter = LeagueConverter;
//# sourceMappingURL=league.converter.js.map