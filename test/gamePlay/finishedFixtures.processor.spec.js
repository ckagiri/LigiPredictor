"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repo_1 = require("../../src/db/repositories/user.repo");
const prediction_repo_1 = require("../../src/db/repositories/prediction.repo");
let userRepo = user_repo_1.UserRepository.getInstance();
let predictionRepo = prediction_repo_1.PredictionRepository.getInstance();
let user1, user2, league, season, team1, team2, team3, team4, fixture1, fixture2;
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
describe('Leaderboard Updater', function () {
    this.timeout(5000);
});
//# sourceMappingURL=finishedFixtures.processor.spec.js.map