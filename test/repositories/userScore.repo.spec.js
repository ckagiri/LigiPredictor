"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
let user1, user2, league, season, team1, team2, team3, team4, fixture1, fixture2, user1Pred1, user2Pred1, sBoard, rBoard;
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
            user1Pred1 = predictions[1];
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
    describe.only('find and upsert', () => {
        it('should create a userScore if it does not exist', done => {
            let leaderboardId = sBoard.id;
            console.log('l', sBoard);
            let userId = user1.id;
            console.log('u', user1);
            let fixtureId = fixture1.id;
            console.log('f', fixture1);
            let predictionId = user1Pred1.id;
            console.log('p', user1Pred1);
            let points = {
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
            userScoreRepo.findOneAndUpsert$(leaderboardId, userId, fixtureId, predictionId, points, hasJoker)
                .subscribe(score => {
                console.log(score);
                done();
            });
        });
        xit('should update a userScore if it exists', done => {
            done();
        });
    });
    xit('should find by leaderboard and order by points', done => {
        done();
    });
    xit('should find by id and update positions', done => {
        done();
    });
});
//# sourceMappingURL=userScore.repo.spec.js.map