"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const team_model_1 = require("../models/team.model");
const baseProvider_repo_1 = require("./baseProvider.repo");
const team_converter_1 = require("../converters/team.converter");
class TeamRepository extends baseProvider_repo_1.BaseProviderRepository {
    static getInstance(provider) {
        return new TeamRepository(team_converter_1.TeamConverter.getInstance(provider));
    }
    constructor(converter) {
        super(team_model_1.TeamModel, converter);
    }
    findByNameAndUpdate$(teams) {
        return rxjs_1.Observable.of([{}]);
    }
    getByName$(name) {
        return rxjs_1.Observable.of({});
    }
}
exports.TeamRepository = TeamRepository;
//# sourceMappingURL=team.repo.js.map