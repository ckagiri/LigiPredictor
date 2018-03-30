"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const fixture_repo_1 = require("../../db/repositories/fixture.repo");
const user_repo_1 = require("../../db/repositories/user.repo");
const prediction_repo_1 = require("../../db/repositories/prediction.repo");
const prediction_calculator_1 = require("./prediction.calculator");
const footballApiProvider_1 = require("../../common/footballApiProvider");
class PredictionProcessor {
    constructor(fixtureRepo, userRepo, predictionRepo, predictionCalculator) {
        this.fixtureRepo = fixtureRepo;
        this.userRepo = userRepo;
        this.predictionRepo = predictionRepo;
        this.predictionCalculator = predictionCalculator;
    }
    static getInstance() {
        return new PredictionProcessor(fixture_repo_1.FixtureRepository.getInstance(footballApiProvider_1.FootballApiProvider.LIGI), user_repo_1.UserRepository.getInstance(), prediction_repo_1.PredictionRepository.getInstance(), new prediction_calculator_1.PredictionCalculator());
    }
    getPredictions(fixture) {
        let { season: seasonId, gameRound } = fixture;
        return this.fixtureRepo.findSelectableFixtures$(seasonId, gameRound)
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
                    selectableFixtureIds: fixtureIds,
                    user
                };
            });
        })
            .flatMap(data => {
            let { season: seasonId, gameRound } = fixture;
            let selectableFixtureIds = data.selectableFixtureIds;
            let userId = data.user['_id'];
            return this.predictionRepo.getOrCreateJoker$(userId, seasonId, gameRound, selectableFixtureIds)
                .map(jokerPrediction => {
                return {
                    userId, jokerPrediction
                };
            });
        })
            .flatMap(data => {
            let fixtureId = fixture['_id'];
            let { userId, jokerPrediction } = data;
            if (jokerPrediction.fixture === fixtureId) {
                return rxjs_1.Observable.of({
                    userId, prediction: jokerPrediction
                });
            }
            return this.predictionRepo.findOneOrCreate$(userId, fixtureId)
                .map(prediction => {
                return {
                    userId, prediction
                };
            });
        })
            .toArray()
            .toPromise();
    }
    processPrediction(prediction, fixture) {
        let { choice } = prediction;
        let { result } = fixture;
        let score = this.predictionCalculator.calculateScore(choice, result);
        return this.predictionRepo.findByIdAndUpdate$(prediction['_id'], { score });
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