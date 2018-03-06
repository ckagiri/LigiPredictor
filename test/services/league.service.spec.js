"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const chai_1 = require("chai");
const league_model_1 = require("../../src/db/models/league.model");
const league_repo_1 = require("../../src/db/repositories/league.repo");
const league_converter_1 = require("../../src/db/converters/league.converter");
const league_service_1 = require("../../src/db/services/league.service");
describe.only('LeagueService', () => {
    let service;
    before(() => {
        mongoose.connect('mongodb://localhost:27017/test123-test');
        mongoose.Promise = global.Promise;
        service = new league_service_1.LeagueService(league_repo_1.LeagueRepository.getInstance(), league_converter_1.LeagueConverter.getInstance());
    });
    after((done) => {
        league_model_1.LeagueModel.remove({}, (err) => {
            mongoose.disconnect();
            done();
        });
    });
    it('should save a new league', (done) => {
        const league = {
            name: 'English Premier League',
            slug: 'english_premier_league',
            code: 'epl'
        };
        service.save$(league).subscribe(l => {
            chai_1.assert.notEqual(l._id, undefined);
            chai_1.assert.equal(l.name, league.name);
            chai_1.assert.equal(l.slug, league.slug);
            chai_1.assert.equal(l.code, league.code);
            done();
        });
    });
});
//# sourceMappingURL=league.service.spec.js.map