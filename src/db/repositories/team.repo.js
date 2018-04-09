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
        let partialUpdate = true;
        if (obj == undefined) {
            obj = name;
            name = obj.name;
            partialUpdate = false;
        }
        let query = {
            $or: [{ 'name': name }, { 'shortName': name }, { 'aliases': name }]
        };
        if (partialUpdate) {
            return this._baseRepo.findOneAndUpdate$(query, obj);
        }
        return this._converter.from(obj)
            .flatMap((obj) => {
            let { externalReference } = obj;
            delete obj.externalReference;
            return this._findOneAndUpdate$(query, obj, externalReference);
        });
    }
    findEachByNameAndUpdate$(objs) {
        let obs = [];
        for (let obj of objs) {
            obs.push(this.findByNameAndUpdate$(obj));
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