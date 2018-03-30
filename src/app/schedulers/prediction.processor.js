"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const fixture_repo_1 = require("../../db/repositories/fixture.repo");
const user_repo_1 = require("../../db/repositories/user.repo");
const prediction_repo_1 = require("../../db/repositories/prediction.repo");
const footballApiProvider_1 = require("../../common/footballApiProvider");
class PredictionProcessor {
    constructor(fixtureRepo, userRepo, predictionRepo) {
        this.fixtureRepo = fixtureRepo;
        this.userRepo = userRepo;
        this.predictionRepo = predictionRepo;
    }
    static getInstance() {
        return new PredictionProcessor(fixture_repo_1.FixtureRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI), user_repo_1.UserRepository.getInstance(), prediction_repo_1.PredictionRepository.getInstance());
    }
    getPredictions(fixture) {
        let { season, gameRound } = fixture;
        return this.fixtureRepo.findSelectableFixtures$(season, gameRound)
            .map(selectableFixtures => {
            return [...selectableFixtures, fixture].map(n => n['_id']);
        })
            .flatMap(fixtureIds => {
            return this.userRepo.findAll$()
                .flatMap(users => {
                return rxjs_1.Observable.from(users);
            })
                .map(user => {
                return {
                    selectableFixtures: fixtureIds,
                    user
                };
            });
        })
            .flatMap(data => {
            let { season, gameRound } = fixture;
            let selectableFixtures = data.selectableFixtures;
            let user = data.user['_id'];
            return this.predictionRepo.getOrCreateJoker$(user, season, gameRound, selectableFixtures);
        })
            .toArray()
            .toPromise();
    }
}
exports.PredictionProcessor = PredictionProcessor;
// getPredictions(fixture)
// getSelectableFixtures(seasoId, gameRound)  
// getOrCreateJokerPrediction(user, seasonId, gameRound, selectable:[])
// getOrCreatePrediction(user, fixture)
// processPrediction(prediction.choice, fixture.result)
// predictionCalculator.calculateScore
// updatePrediction(id, score)
//# sourceMappingURL=prediction.processor.js.map