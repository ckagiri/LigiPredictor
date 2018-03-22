"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const league_model_1 = require("../models/league.model");
const baseProvider_repo_1 = require("./baseProvider.repo");
const league_converter_1 = require("../converters/league.converter");
class LeagueRepository extends baseProvider_repo_1.BaseProviderRepository {
    static getInstance(provider) {
        return new LeagueRepository(league_converter_1.LeagueConverter.makeLeagueConverter(provider));
    }
    constructor(converter) {
        super(league_model_1.LeagueModel, converter);
    }
}
exports.LeagueRepository = LeagueRepository;
//# sourceMappingURL=league.repo.js.map