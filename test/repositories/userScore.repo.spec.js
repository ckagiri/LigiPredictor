"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const db = require("../../src/db/index");
const index_1 = require("../../src/config/environment/index");
const user_model_1 = require("../../src/db/models/user.model");
const league_model_1 = require("../../src/db/models/league.model");
const season_model_1 = require("../../src/db/models/season.model");
const team_model_1 = require("../../src/db/models/team.model");
const fixture_model_1 = require("../../src/db/models/fixture.model");
const prediction_model_1 = require("../../src/db/models/prediction.model");
const leaderboard_model_1 = require("../../src/db/models/leaderboard.model");
const userScore_repo_1 = require("../../src/db/repositories/userScore.repo");
let userScoreRepo = userScore_repo_1.UserScoreRepository.getInstance();
let user1, user2, league, season, team1, team2, team3, team4, fixture1, fixture2, user1Pred1, user1Pred2, user2Pred1, sBoard, rBoard;
const epl = {
    name: 'English Premier League',
    slug: 'english_premier_league',
    code: 'epl'
};
let epl17 = {
    name: "2017-2018",
    slug: "17-18",
    year: 2017,
    seasonStart: '2017-08-11T00:00:00+0200',
    seasonEnd: '2018-05-13T16:00:00+0200',
    currentMatchRound: 20,
    currentGameRound: 20,
    league: null
};
const manu = {
    name: 'Manchester United FC',
    shortName: 'Man United',
    code: 'MUN',
    slug: 'man_united',
    crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Manchester_United_FC.svg',
    aliases: ['ManU', 'ManUtd']
};
const manc = {
    name: 'Manchester City FC',
    shortName: 'Man City',
    code: 'MCI',
    slug: 'man_city',
    crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Manchester_City_FC.svg',
    aliases: ['ManCity']
};
const che = {
    name: 'Chelsea FC',
    shortName: 'Chelsea',
    code: 'CHE',
    slug: 'chelsea',
    crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Chelsea_FC.svg',
    aliases: ['Chelsea']
};
const ars = {
    name: 'Arsenal FC',
    shortName: 'Arsenal',
    code: 'ARS',
    slug: 'arsenal',
    crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Arsenal_FC.svg',
    aliases: ['Arsenal']
};
const manuVmanc = {
    date: "2017-09-10T11:30:00Z",
    status: "SCHEDULED",
    matchRound: 20,
    gameRound: 20,
    season: null,
    homeTeam: null,
    awayTeam: null,
    slug: null,
    result: {}
};
const cheVars = {
    date: "2017-09-10T11:30:00Z",
    status: "SCHEDULED",
    matchRound: 20,
    gameRound: 20,
    season: null,
    homeTeam: null,
    awayTeam: null,
    slug: null,
    result: {}
};
const chalo = {
    username: 'chalo',
    email: 'chalo@example.com'
};
const kagiri = {
    username: 'kagiri',
    email: 'kagiri@example.com'
};
describe.only('UserScore Repo', function () {
    this.timeout(5000);
    before(done => {
        db.init(index_1.config.testDb.uri, done, { drop: true });
    });
    beforeEach(done => {
        user_model_1.UserModel.create([chalo, kagiri])
            .then(users => {
            user1 = users[0];
            user2 = users[1];
            return league_model_1.LeagueModel.create(epl);
        })
            .then(l => {
            league = l;
            let { name, slug, id } = l;
            epl17.league = { name, slug, id };
            return season_model_1.SeasonModel.create(epl17);
        })
            .then(s => {
            season = s;
            return team_model_1.TeamModel.create([manu, manc, che, ars]);
        })
            .then(teams => {
            team1 = teams[0];
            team2 = teams[1];
            team3 = teams[2];
            team4 = teams[3];
            manuVmanc.season = season._id;
            cheVars.season = season._id;
            manuVmanc.homeTeam = {
                name: team1.name,
                slug: team1.slug,
                id: team1._id
            };
            manuVmanc.awayTeam = {
                name: team2.name,
                slug: team2.slug,
                id: team2._id
            };
            manuVmanc.slug = `${team1.slug}-${team2.slug}`;
            cheVars.homeTeam = {
                name: team3.name,
                slug: team3.slug,
                id: team3._id
            };
            cheVars.awayTeam = {
                name: team4.name,
                slug: team4.slug,
                id: team4._id
            };
            cheVars.slug = `${team3.slug}-${team4.slug}`;
            return fixture_model_1.FixtureModel.create([manuVmanc, cheVars]);
        })
            .then(fixtures => {
            fixture1 = fixtures[0];
            fixture2 = fixtures[1];
            let pred1 = {
                user: user1.id, fixture: fixture1.id, fixtureSlug: fixture1.slug, season: season.id, gameRound: fixture1.gameRound,
                choice: { goalsHomeTeam: 1, goalsAwayTeam: 0, isComputerGenerated: true }
            };
            let pred2 = {
                user: user1.id, fixture: fixture2.id, fixtureSlug: fixture2.slug, season: season.id, gameRound: fixture2.gameRound,
                choice: { goalsHomeTeam: 2, goalsAwayTeam: 0, isComputerGenerated: true }
            };
            let pred3 = {
                user: user2.id, fixture: fixture1.id, fixtureSlug: fixture1.slug, season: season.id, gameRound: fixture1.gameRound,
                choice: { goalsHomeTeam: 3, goalsAwayTeam: 0, isComputerGenerated: true }
            };
            return prediction_model_1.PredictionModel.create([pred1, pred2, pred3]);
        })
            .then(predictions => {
            user1Pred1 = predictions[0];
            user1Pred2 = predictions[1];
            user2Pred1 = predictions[2];
            return leaderboard_model_1.LeaderboardModel.create([
                {
                    status: leaderboard_model_1.BoardStatus.UPDATING_SCORES,
                    boardType: leaderboard_model_1.BoardType.GLOBAL_SEASON,
                    season: season.id
                }, {
                    status: leaderboard_model_1.BoardStatus.REFRESHED,
                    boardType: leaderboard_model_1.BoardType.GLOBAL_ROUND,
                    season: season.id,
                    gameRound: 20
                }
            ]);
        })
            .then(leaderboards => {
            sBoard = leaderboards[0];
            rBoard = leaderboards[1];
            done();
        });
    });
    afterEach(done => {
        db.drop().then(() => { done(); });
    });
    after(done => {
        db.close().then(() => { done(); });
    });
    describe('find and upsert', () => {
        it('should create a userScore if it does not exist', done => {
            let leaderboardId = sBoard.id;
            let userId = user1.id;
            let fixtureId = fixture1.id;
            let predictionId = user1Pred1.id;
            let predictionPoints = {
                points: 7,
                APoints: 7,
                BPoints: 0,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 3,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: 0
            };
            let hasJoker = true;
            userScoreRepo.findOneAndUpsert$(leaderboardId, userId, fixtureId, predictionId, predictionPoints, hasJoker)
                .subscribe(score => {
                chai_1.expect(score.pointsExcludingJoker).to.equal(7);
                chai_1.expect(score.APointsExcludingJoker).to.equal(7);
                chai_1.expect(score.BPointsExcludingJoker).to.equal(0);
                chai_1.expect(score.points).to.equal(14);
                chai_1.expect(score.APoints).to.equal(14);
                chai_1.expect(score.BPoints).to.equal(0);
                chai_1.expect(score.fixtures).to.contain(fixture1.id);
                chai_1.expect(score.predictions).to.contain(user1Pred1.id);
                done();
            });
        });
        it('should update a userScore if it exists', done => {
            let leaderboardId = sBoard.id;
            let userId = user1.id;
            let fixtureId = fixture1.id;
            let predictionId = user1Pred1.id;
            let score1 = {
                leaderboard: leaderboardId,
                user: userId,
                points: 14,
                APoints: 14,
                BPoints: 0,
                MatchOutcomePoints: 8,
                TeamScorePlusPoints: 6,
                ExactScorePoints: 0,
                GoalDifferencePoints: 0,
                TeamScoreMinusPoints: 0,
                fixtures: [fixtureId],
                predictions: [predictionId],
                pointsExcludingJoker: 7,
                APointsExcludingJoker: 7,
                BPointsExcludingJoker: 0
            };
            userScoreRepo.insert$(score1)
                .flatMap(_ => {
                let predictionPoints = {
                    points: 10,
                    APoints: 8,
                    BPoints: 2,
                    MatchOutcomePoints: 4,
                    TeamScorePlusPoints: 4,
                    GoalDifferencePoints: 1,
                    ExactScorePoints: 1,
                    TeamScoreMinusPoints: 0
                };
                let hasJoker = false;
                fixtureId = fixture2.id;
                predictionId = user1Pred2.id;
                return userScoreRepo.findOneAndUpsert$(leaderboardId, userId, fixtureId, predictionId, predictionPoints, hasJoker);
            })
                .subscribe(score => {
                chai_1.expect(score.pointsExcludingJoker).to.equal(17);
                chai_1.expect(score.APointsExcludingJoker).to.equal(15);
                chai_1.expect(score.BPointsExcludingJoker).to.equal(2);
                chai_1.expect(score.points).to.equal(24);
                chai_1.expect(score.APoints).to.equal(22);
                chai_1.expect(score.BPoints).to.equal(2);
                chai_1.expect(score.fixtures).to.contain(fixture1.id, fixture2.id);
                chai_1.expect(score.predictions).to.contain(user1Pred1.id, user1Pred2.id);
                done();
            });
        });
    });
    it('should find by leaderboard and order by points', done => {
        let leaderboardId = sBoard.id;
        let fixtureId = fixture1.id;
        let score1 = {
            leaderboard: leaderboardId,
            user: user1.id,
            points: 14,
            APoints: 14,
            BPoints: 0,
            MatchOutcomePoints: 8,
            TeamScorePlusPoints: 6,
            ExactScorePoints: 0,
            GoalDifferencePoints: 0,
            TeamScoreMinusPoints: 0,
            fixtures: [fixtureId],
            predictions: [user1Pred1.id],
            pointsExcludingJoker: 7,
            APointsExcludingJoker: 7,
            BPointsExcludingJoker: 0
        };
        let score2 = {
            leaderboard: leaderboardId,
            user: user2.id,
            points: 10,
            APoints: 8,
            BPoints: 2,
            MatchOutcomePoints: 4,
            TeamScorePlusPoints: 4,
            ExactScorePoints: 1,
            GoalDifferencePoints: 1,
            TeamScoreMinusPoints: 0,
            fixtures: [fixtureId],
            predictions: [user2Pred1.id],
            pointsExcludingJoker: 7,
            APointsExcludingJoker: 7,
            BPointsExcludingJoker: 0
        };
        userScoreRepo.insertMany$([score2, score1])
            .flatMap(_ => {
            return userScoreRepo.findByLeaderboardOrderByPoints$(sBoard.id);
        })
            .subscribe(standings => {
            chai_1.expect(standings[0].points).to.be.at.least(standings[1].points);
            done();
        });
    });
    it('should find by id and update positions', done => {
        let leaderboardId = sBoard.id;
        let userId = user1.id;
        let fixtureId = fixture1.id;
        let predictionId = user1Pred1.id;
        let score1 = {
            leaderboard: leaderboardId,
            user: userId,
            points: 14,
            APoints: 14,
            BPoints: 0,
            MatchOutcomePoints: 8,
            TeamScorePlusPoints: 6,
            ExactScorePoints: 0,
            GoalDifferencePoints: 0,
            TeamScoreMinusPoints: 0,
            fixtures: [fixtureId],
            predictions: [predictionId],
            pointsExcludingJoker: 7,
            APointsExcludingJoker: 7,
            BPointsExcludingJoker: 0,
            positionNew: 1,
            positionOld: 2
        };
        userScoreRepo.insert$(score1)
            .flatMap(standing => {
            let prevPosition = standing.positionNew;
            let positionOld = prevPosition;
            let positionNew = prevPosition + 1;
            return userScoreRepo.findByIdAndUpdate$(standing.id, { positionNew, positionOld });
        })
            .subscribe(standing => {
            console.log('pn', standing.positionNew);
            console.log('po', standing.positionOld);
            done();
        });
    });
});
//# sourceMappingURL=userScore.repo.spec.js.map