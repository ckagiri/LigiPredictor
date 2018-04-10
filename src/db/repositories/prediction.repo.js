"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const prediction_model_1 = require("../models/prediction.model");
const fixture_model_1 = require("../models/fixture.model");
const base_repo_1 = require("./base.repo");
const fixture_repo_1 = require("./fixture.repo");
const footballApiProvider_1 = require("../../common/footballApiProvider");
const predictor_1 = require("../../common/predictor");
class PredictionRepository extends base_repo_1.BaseRepository {
    constructor(fixtureRepo, randomPredictor) {
        super(prediction_model_1.PredictionModel);
        this.randomPredictor = randomPredictor;
        this.fixtureRepo = fixtureRepo;
    }
    static getInstance() {
        return new PredictionRepository(fixture_repo_1.FixtureRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI), predictor_1.VosePredictor.getInstance());
    }
    findOrCreateJoker$(userId, seasonId, gameRound, pick) {
        let query = {
            user: userId, season: seasonId, gameRound, hasJoker: true
        };
        return this.findOne$(query)
            .flatMap(currentJoker => {
            let newJokerFixtureId;
            if (pick instanceof Array) {
                if (currentJoker) {
                    return rxjs_1.Observable.of(currentJoker);
                }
                else {
                    newJokerFixtureId = pick[Math.floor(Math.random() * pick.length)];
                    return this.pickJoker$(userId, currentJoker, newJokerFixtureId, true);
                }
            }
            else {
                newJokerFixtureId = pick;
                if (currentJoker && currentJoker.status === prediction_model_1.PredictionStatus.PROCESSED) {
                    return rxjs_1.Observable.throw(new Error('Joker prediction already processed'));
                }
                return this.pickJoker$(userId, currentJoker, newJokerFixtureId, false);
            }
        });
    }
    pickJoker$(userId, currentJoker, newJokerFixtureId, autoPicked) {
        let newJokerFixture;
        return this.fixtureRepo.findById$(newJokerFixtureId)
            .flatMap(fixture => {
            if (!fixture) {
                return rxjs_1.Observable.throw(new Error('Fixture does not exist'));
            }
            newJokerFixture = fixture;
            if (autoPicked || newJokerFixture.status === fixture_model_1.FixtureStatus.SCHEDULED || newJokerFixture.status === fixture_model_1.FixtureStatus.TIMED) {
                return super.findOne$({ user: userId, fixture: newJokerFixtureId });
            }
            return rxjs_1.Observable.throw(new Error('Fixture not scheduled'));
        })
            .catch((error) => {
            return rxjs_1.Observable.throw(error);
        })
            .flatMap((newJokerPrediction) => {
            let { slug: fixtureSlug, season, gameRound, odds } = newJokerFixture;
            let newJoker;
            if (!newJokerPrediction) {
                let randomMatchScore = this.getRandomMatchScore(odds);
                newJoker = {
                    user: userId, fixture: newJokerFixtureId, fixtureSlug, season, gameRound,
                    hasJoker: true, jokerAutoPicked: autoPicked, choice: randomMatchScore
                };
            }
            else {
                newJoker = newJokerPrediction;
                newJoker.hasJoker = true;
                newJoker.jokerAutoPicked = autoPicked;
            }
            let predictionJokers = [newJoker];
            if (currentJoker) {
                currentJoker.hasJoker = false;
                predictionJokers.push(currentJoker);
            }
            return this.insertMany$(predictionJokers);
        })
            .flatMap(predictions => {
            return rxjs_1.Observable.from(predictions);
        })
            .filter(prediction => {
            return prediction.fixture.toString() === newJokerFixture.id;
        })
            .first();
    }
    getRandomMatchScore(odds) {
        let score = this.randomPredictor.predict(odds);
        let { goalsHomeTeam, goalsAwayTeam } = score;
        return {
            goalsHomeTeam, goalsAwayTeam,
            isComputerGenerated: true
        };
    }
    findOneOrCreate$({ userId, fixtureId }) {
        let query = { user: userId, fixture: fixtureId };
        return this.findOne$(query)
            .flatMap(prediction => {
            if (prediction) {
                return rxjs_1.Observable.of(prediction);
            }
            return this.fixtureRepo.findById$(fixtureId)
                .flatMap(fixture => {
                let { slug: fixtureSlug, season, gameRound, odds } = fixture;
                let pred = { user: userId, fixture: fixtureId, fixtureSlug, season, gameRound, choice: null };
                let randomMatchScore = this.getRandomMatchScore(odds);
                pred.choice = randomMatchScore;
                return this.save$(pred);
            });
        });
    }
    findOneAndUpsert$({ userId, fixtureId }, choice) {
        return rxjs_1.Observable.throw(new Error('method not implemented'));
    }
    findOne$(query) {
        let { userId, fixtureId } = query;
        if (userId !== undefined && fixtureId !== undefined) {
            query.user = userId;
            query.fixture = fixtureId;
            delete query.userId;
            delete query.fixtureId;
        }
        return super.findOne$(query);
    }
}
exports.PredictionRepository = PredictionRepository;
//# sourceMappingURL=prediction.repo.js.map