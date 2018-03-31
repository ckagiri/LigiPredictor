"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const fixture_model_1 = require("../../db/models/fixture.model");
const user_repo_1 = require("../../db/repositories/user.repo");
class LeaderboardUpdater {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    static getInstance() {
        user_repo_1.UserRepository.getInstance();
    }
    updateScores(fixtures) {
        return rxjs_1.Observable.from(fixtures)
            .filter(fixture => {
            return fixture.status === fixture_model_1.FixtureStatus.FINISHED && fixture.allPredictionsProcessed === false;
        })
            .flatMap(fixture => {
            return this.userRepo.findAll$()
                .map(user => {
                return { user, fixture };
            });
        })
            .toPromise();
        // fe fixtures
        // fe user
        // fe lbs
        // fe pred
        // fe score
    }
    updateRankigs() {
        throw new Error("Method not implemented.");
    }
}
exports.LeaderboardUpdater = LeaderboardUpdater;
//# sourceMappingURL=leaderboard.updater.js.map