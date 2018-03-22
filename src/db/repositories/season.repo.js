"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const season_model_1 = require("../models/season.model");
const baseProvider_repo_1 = require("./baseProvider.repo");
const season_converter_1 = require("../converters/season.converter");
class SeasonRepository extends baseProvider_repo_1.BaseProviderRepository {
    static getInstance(provider) {
        return new SeasonRepository(season_converter_1.SeasonConverter.getInstance(provider));
    }
    constructor(converter) {
        super(season_model_1.SeasonModel, converter);
    }
}
exports.SeasonRepository = SeasonRepository;
//# sourceMappingURL=season.repo.js.map