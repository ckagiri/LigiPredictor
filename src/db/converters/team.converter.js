"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const team_converter_1 = require("../converters/ligi/team.converter");
const team_converter_2 = require("../converters/apiFootballData/team.converter");
const footballApiProvider_1 = require("../../common/footballApiProvider");
class TeamConverter {
    static makeTeamConverter(provider) {
        switch (provider) {
            case footballApiProvider_1.FootballApiProvider.LIGI:
                return new team_converter_1.TeamConverter();
            case footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA:
                return new team_converter_2.TeamConverter();
            default:
                throw new Error('Converter for Provider does not exist');
        }
    }
}
exports.TeamConverter = TeamConverter;
//# sourceMappingURL=team.converter.js.map