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
    findByNameAndUpdate$(name, obj) {
        let query;
        if (obj == undefined) {
            obj = name;
            name = obj.name;
            query = {
                $or: [{ 'name': name }, { 'shortName': name }, { 'aliases': name }]
            };
            return this._converter.from(obj)
                .flatMap((obj) => {
                let { externalReference } = obj;
                delete obj.externalReference;
                Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
                return this._findOneAndUpdate$(query, obj, externalReference);
            });
        }
        else {
            query = {
                $or: [{ 'name': name }, { 'shortName': name }, { 'aliases': name }]
            };
            Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
            return this._baseRepo.findOneAndUpdate$(query, obj);
        }
    }
    findEachByNameAndUpdate$(teams) {
        let obs = [];
        for (let team of teams) {
            obs.push(this.findByNameAndUpdate$(team));
        }
        return rxjs_1.Observable.forkJoin(obs);
    }
    findByName$(name) {
        let query = {
            $or: [
                { 'name': name },
                { 'shortName': name },
                { 'aliases': name }
            ]
        };
        return this.findOne$(query);
    }
}
exports.TeamRepository = TeamRepository;
//# sourceMappingURL=team.repo.js.map