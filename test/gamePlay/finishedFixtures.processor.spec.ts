import { Observable } from 'rxjs'
import { expect } from 'chai';

import { UserModel as User } from '../../src/db/models/user.model';
import { LeagueModel as League } from '../../src/db/models/league.model';
import { SeasonModel as Season } from '../../src/db/models/season.model';
import { TeamModel as Team } from '../../src/db/models/team.model';
import { FixtureModel as Fixture } from '../../src/db/models/fixture.model';
import { IPrediction, IPredictionModel as Prediction } from '../../src/db/models/prediction.model';

import { UserRepository } from '../../src/db/repositories/user.repo';
import { PredictionRepository } from '../../src/db/repositories/prediction.repo';
import * as db from '../../src/db/index';
import { config } from '../../src/config/environment/index'
import { ScorePoints } from '../../src/common/score'

let userRepo = UserRepository.getInstance();
let predictionRepo = PredictionRepository.getInstance();
let user1: any, user2: any, league: any, season: any, team1: any, team2: any, 
team3: any, team4: any, fixture1: any, fixture2: any;

const epl = {
  name: 'English Premier League',
  slug: 'english_premier_league',
  code: 'epl'
}

let epl17 = {
  name: "2017-2018",
  slug: "17-18",
  year: 2017,
  seasonStart: '2017-08-11T00:00:00+0200',
  seasonEnd: '2018-05-13T16:00:00+0200',
  currentMatchRound: 20,
  currentGameRound: 20,
  league: null
}

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
}
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
}

const chalo = {
  username: 'chalo',
  email: 'chalo@example.com'
}
const kagiri = {
  username: 'kagiri',
  email: 'kagiri@example.com'
}

describe('Leaderboard Updater', function () {
  this.timeout(5000);

  
})