"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const chai_1 = require("chai");
const sinon = require("sinon");
const rxjs_1 = require("rxjs");
const league_model_1 = require("../../src/db/models/league.model");
const league_repo_1 = require("../../src/db/repositories/league.repo");
const footballApiProvider_1 = require("../../src/common/footballApiProvider");
const league = {
    name: 'English Premier League',
    slug: 'english_premier_league',
    code: 'epl'
};
let mockLeagueRepo = {
    save$(obj) {
        return rxjs_1.Observable.create((observer) => {
            observer.next(new league_model_1.LeagueModel(league));
            observer.complete();
        });
    }
};
describe('LeagueRepo', () => {
    before((done) => {
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost:27017/test123-test');
        mongoose.connection
            .once('open', () => done())
            .on('error', (error) => {
            console.warn('Error', error);
        });
    });
    after((done) => {
        league_model_1.LeagueModel.remove({}, (err) => {
            mongoose.disconnect();
            done();
        });
    });
    it('should save a new league', (done) => {
        let saveSpy = sinon.spy(mockLeagueRepo, 'save$');
        let repo = mockLeagueRepo;
        repo.save$(league).subscribe((obj => {
            chai_1.assert.isTrue(saveSpy.calledOnce);
            chai_1.assert.equal(saveSpy.firstCall.args[0].name, 'English Premier League');
            chai_1.assert.equal(obj['name'], 'English Premier League');
            saveSpy.restore();
            done();
        }));
    });
    describe('with real repo', function () {
        this.timeout(5000);
        let repo = league_repo_1.LeagueRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI);
        it('should save a new league', (done) => {
            repo.save$(league).subscribe(l => {
                chai_1.assert.notEqual(l['_id'], undefined);
                chai_1.assert.equal(l.name, league.name);
                chai_1.assert.equal(l.slug, league.slug);
                chai_1.assert.equal(l.code, league.code);
                done();
            });
        });
    });
});
//# sourceMappingURL=league.repo.spec.js.map