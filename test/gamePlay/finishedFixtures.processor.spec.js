"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const user_model_1 = require("../../src/db/models/user.model");
const league_model_1 = require("../../src/db/models/league.model");
const season_model_1 = require("../../src/db/models/season.model");
const team_model_1 = require("../../src/db/models/team.model");
const fixture_model_1 = require("../../src/db/models/fixture.model");
const prediction_model_1 = require("../../src/db/models/prediction.model");
const db = require("../../src/db/index");
const index_1 = require("../../src/config/environment/index");
const utils_1 = require("./utils");
const finishedFixtures_processor_1 = require("../../src/app/schedulers/finishedFixtures.processor");
let user1, user2, league, season, team1, team2, team3, team4, fixture1, fixture2, user1Pred1, user1Pred2, user2Pred1, user2Pred2, sBoard, rBoard;
let finishedFixturesProcessor = finishedFixtures_processor_1.FinishedFixturesProcessor.getInstance();
describe('Finished Fixtures Processor', function () {
    this.timeout(5000);
    before(done => {
        db.init(index_1.config.testDb.uri, done, { drop: true });
    });
    beforeEach(done => {
        user_model_1.UserModel.create([utils_1.default.chalo, utils_1.default.kagiri])
            .then(users => {
            user1 = users[0];
            user2 = users[1];
            return league_model_1.LeagueModel.create(utils_1.default.epl);
        })
            .then(l => {
            league = l;
            let { name, slug, id } = l;
            utils_1.default.epl17.league = { name, slug, id };
            return season_model_1.SeasonModel.create(utils_1.default.epl17);
        })
            .then(s => {
            season = s;
            return team_model_1.TeamModel.create([utils_1.default.manu, utils_1.default.manc, utils_1.default.che, utils_1.default.ars]);
        })
            .then(teams => {
            team1 = teams[0];
            team2 = teams[1];
            team3 = teams[2];
            team4 = teams[3];
            utils_1.default.manuVmanc.season = season._id;
            utils_1.default.manuVmanc.homeTeam = {
                name: team1.name,
                slug: team1.slug,
                id: team1._id
            };
            utils_1.default.manuVmanc.awayTeam = {
                name: team2.name,
                slug: team2.slug,
                id: team2._id
            };
            utils_1.default.manuVmanc.slug = `${team1.slug}-${team2.slug}`;
            utils_1.default.cheVars.season = season._id;
            utils_1.default.cheVars.homeTeam = {
                name: team3.name,
                slug: team3.slug,
                id: team3._id
            };
            utils_1.default.cheVars.awayTeam = {
                name: team4.name,
                slug: team4.slug,
                id: team4._id
            };
            utils_1.default.cheVars.slug = `${team3.slug}-${team4.slug}`;
            return fixture_model_1.FixtureModel.create([utils_1.default.manuVmanc, utils_1.default.cheVars]);
        })
            .then(fixtures => {
            fixture1 = fixtures[0];
            fixture2 = fixtures[1];
            let pred1 = {
                user: user1.id, fixture: fixture1.id, fixtureSlug: fixture1.slug, season: season.id, gameRound: fixture1.gameRound,
                choice: { goalsHomeTeam: 2, goalsAwayTeam: 0, isComputerGenerated: true }
            };
            let pred2 = {
                user: user1.id, fixture: fixture2.id, fixtureSlug: fixture2.slug, season: season.id, gameRound: fixture2.gameRound,
                choice: { goalsHomeTeam: 1, goalsAwayTeam: 0, isComputerGenerated: true }
            };
            let pred3 = {
                user: user2.id, fixture: fixture1.id, fixtureSlug: fixture1.slug, season: season.id, gameRound: fixture1.gameRound,
                choice: { goalsHomeTeam: 1, goalsAwayTeam: 1, isComputerGenerated: true }
            };
            let pred4 = {
                user: user2.id, fixture: fixture2.id, fixtureSlug: fixture2.slug, season: season.id, gameRound: fixture2.gameRound,
                choice: { goalsHomeTeam: 3, goalsAwayTeam: 0, isComputerGenerated: true }
            };
            return prediction_model_1.PredictionModel.create([pred1, pred2, pred3, pred4]);
        })
            .then(predictions => {
            user1Pred1 = predictions[0];
            user1Pred2 = predictions[1];
            user2Pred1 = predictions[2];
            user2Pred2 = predictions[3];
            done();
        });
    });
    afterEach(done => {
        db.drop().then(() => { done(); });
    });
    after(done => {
        db.close().then(() => { done(); });
    });
    it('should process predictions', () => __awaiter(this, void 0, void 0, function* () {
        fixture1.status = fixture_model_1.FixtureStatus.FINISHED;
        fixture1.result = {
            goalsHomeTeam: 2, goalsAwayTeam: 1,
        };
        fixture2.status = fixture_model_1.FixtureStatus.FINISHED;
        fixture2.result = {
            goalsHomeTeam: 3, goalsAwayTeam: 0,
        };
        let c = yield finishedFixturesProcessor.processPredictions([fixture1, fixture2]);
        chai_1.expect(c).to.equal(4);
        prediction_model_1.PredictionModel.find({}).exec().then(ps => {
            // console.log(ps)
            chai_1.expect(ps.length).to.equal(4);
        });
    }));
    it('should process predictions', () => __awaiter(this, void 0, void 0, function* () {
        fixture1.status = fixture_model_1.FixtureStatus.FINISHED;
        fixture1.result = {
            goalsHomeTeam: 2, goalsAwayTeam: 1,
        };
        fixture2.status = fixture_model_1.FixtureStatus.FINISHED;
        fixture2.result = {
            goalsHomeTeam: 3, goalsAwayTeam: 0,
        };
        let c = yield finishedFixturesProcessor.processPredictions([fixture1, fixture2]);
        chai_1.expect(c).to.equal(4);
        prediction_model_1.PredictionModel.find({}).exec().then(ps => {
            chai_1.expect(ps.length).to.equal(4);
        });
    }));
});
//# sourceMappingURL=finishedFixtures.processor.spec.js.map