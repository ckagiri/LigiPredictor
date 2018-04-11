"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fixture_model_1 = require("../../src/db/models/fixture.model");
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
    status: fixture_model_1.FixtureStatus.FINISHED,
    matchRound: 20,
    gameRound: 20,
    season: null,
    homeTeam: null,
    awayTeam: null,
    slug: null,
    result: null
};
const cheVars = {
    date: "2017-09-10T11:30:00Z",
    status: fixture_model_1.FixtureStatus.FINISHED,
    matchRound: 20,
    gameRound: 20,
    season: null,
    homeTeam: null,
    awayTeam: null,
    slug: null,
    result: null
};
const chalo = {
    username: 'chalo',
    email: 'chalo@example.com'
};
const kagiri = {
    username: 'kagiri',
    email: 'kagiri@example.com'
};
const points1 = {
    points: 10,
    APoints: 8,
    BPoints: 2,
    MatchOutcomePoints: 4,
    TeamScorePlusPoints: 4,
    GoalDifferencePoints: 1,
    ExactScorePoints: 1,
    TeamScoreMinusPoints: 0
};
const points2 = {
    points: 7,
    APoints: 7,
    BPoints: 0,
    MatchOutcomePoints: 4,
    TeamScorePlusPoints: 3,
    GoalDifferencePoints: 0,
    ExactScorePoints: 0,
    TeamScoreMinusPoints: 0
};
exports.default = {
    chalo, kagiri, epl, epl17, manu, manc, ars, che, manuVmanc, cheVars, points1, points2
};
//# sourceMappingURL=utils.js.map