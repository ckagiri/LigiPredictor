"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fixture_converter_1 = require("../converters/ligi/fixture.converter");
const fixture_converter_2 = require("../converters/apiFootballData/fixture.converter");
const footballApiProvider_1 = require("../../common/footballApiProvider");
class FixtureConverter {
    static getInstance(provider) {
        switch (provider) {
            case footballApiProvider_1.FootballApiProvider.LIGI:
                return fixture_converter_1.FixtureConverter.getInstance();
            case footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA:
                return fixture_converter_2.FixtureConverter.getInstance();
            default:
                throw new Error('Converter for Provider does not exist');
        }
    }
}
exports.FixtureConverter = FixtureConverter;
//# sourceMappingURL=fixture.converter.js.map