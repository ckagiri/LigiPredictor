"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const mongoose = require("mongoose");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const server_1 = require("../../src/app/server");
const league_model_1 = require("../../src/db/models/league.model");
const season_model_1 = require("../../src/db/models/season.model");
const team_model_1 = require("../../src/db/models/team.model");
function clearData(done) {
    let promises = [];
    promises.push(league_model_1.LeagueModel.remove({}).exec(), season_model_1.SeasonModel.remove({}).exec(), team_model_1.TeamModel.remove({}).exec());
    Promise.all(promises).then(() => done());
}
const epl = {
    name: 'English Premier League',
    slug: 'english_premier_league',
    code: 'epl'
};
function addLeague(aLeague) {
    return new Promise((resolve, reject) => {
        new league_model_1.LeagueModel(aLeague).save((err, league) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
describe('League API', function () {
    this.timeout(5000);
    before(done => clearData(done));
    afterEach(done => clearData(done));
    after(done => { mongoose.disconnect(); server_1.server.close(); done(); });
    it('should respond with JSON array', function (done) {
        request(server_1.server)
            .get('/api/v1/leagues')
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
            if (err) {
                return done(err);
            }
            expect(res.body).to.be.an.instanceof(Array);
            done();
        });
    });
    it('should respond with a single league', done => {
        addLeague(epl).then(() => {
            request(server_1.server)
                .get(`/api/v1/leagues/${epl.slug}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res).to.be.json;
                done();
            });
        });
    });
});
//# sourceMappingURL=league.controller.spec.js.map