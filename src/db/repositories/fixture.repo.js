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
        const { SCHEDULED, TIMED, IN_PLAY, CANCELED, POSTPONED, FINISHED } = fixture_model_1.FixtureStatus;
        let query = {
            $or: [
                { $and: [
                        { season: seasonId }, { gameRound },
                        { status: { $in: [SCHEDULED, TIMED, IN_PLAY] } }
                    ] },
                { $and: [
                        { season: seasonId }, { gameRound },
                        { status: { $in: [CANCELED, POSTPONED, FINISHED] } },
                        { allPredictionsProcessed: false }
                    ] }
            ]
        };
        return this.findAll$(query, null, { sort: 'date' });
    }
    findBySeasonAndTeamsAndUpsert$(obj) {
        return this._converter.from(obj)
            .flatMap((obj) => {
            let { season, homeTeam, awayTeam, externalReference } = obj;
            let query = { season, 'homeTeam.id': homeTeam.id, 'awayTeam.id': awayTeam.id };
            delete obj.externalReference;
            Object.keys(obj).forEach(key => (obj[key] == null) && delete obj[key]);
            return this._findOneAndUpsert$(query, obj, externalReference);
        });
    }
    findEachBySeasonAndTeamsAndUpsert$(objs) {
        let obs = [];
        for (let obj of objs) {
            obs.push(this.findBySeasonAndTeamsAndUpsert$(obj));
        }
        return rxjs_1.Observable.forkJoin(obs);
    }
    findAllFinishedWithPendingPredictions$(seasonId, gameRound) {
        let query = {
            $and: [
                { season: seasonId },
                { allPredictionsProcessed: false },
                { status: { $in: ['CANCELED', 'POSTPONED', 'FINISHED'] } }
            ]
        };
        if (gameRound) {
            query.$and.push({ gameRound });
        }
        return this.findAll$(query);
    }
}
exports.FixtureRepository = FixtureRepository;
//# sourceMappingURL=fixture.repo.js.map