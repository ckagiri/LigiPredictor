"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fixture_model_1 = require("../models/fixture.model");
const baseProvider_repo_1 = require("./baseProvider.repo");
const fixture_converter_1 = require("../converters/fixture.converter");
class FixtureRepository extends baseProvider_repo_1.BaseProviderRepository {
    static getInstance(provider) {
        return new FixtureRepository(fixture_converter_1.FixtureConverter.getInstance(provider));
    }
    constructor(converter) {
        super(fixture_model_1.FixtureModel, converter);
    }
}
exports.FixtureRepository = FixtureRepository;
//# sourceMappingURL=fixture.repo.js.map