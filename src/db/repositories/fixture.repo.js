"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
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
    findSelectableFixtures$(seasonId, gameRound) {
        return rxjs_1.Observable.of([{}]);
    }
    findBySeasonAndSlugAndUpdate$(obj) {
        return this._converter.from(obj)
            .flatMap((obj) => {
            let { season, slug, externalReference } = obj;
            let query = { season, slug };
            delete obj.externalReference;
            return this._findOneAndUpdate$(query, obj, externalReference);
        });
    }
    findEachBySeasonAndSlugAndUpdate$(objs) {
        let obs = [];
        for (let obj of objs) {
            obs.push(this.findBySeasonAndSlugAndUpdate$(obj));
        }
        return rxjs_1.Observable.forkJoin(obs);
    }
}
exports.FixtureRepository = FixtureRepository;
//# sourceMappingURL=fixture.repo.js.map