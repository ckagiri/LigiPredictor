import { Observable } from 'rxjs'
import { expect } from 'chai';
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;

import * as db from '../../src/db/index';
import { config } from '../../src/config/environment/index';
import { UserModel as User } from '../../src/db/models/user.model';
import { LeagueModel as League } from '../../src/db/models/league.model';
import { SeasonModel as Season } from '../../src/db/models/season.model';
import { TeamModel as Team } from '../../src/db/models/team.model';
import { FixtureModel as Fixture } from '../../src/db/models/fixture.model';
import { IPrediction, IPredictionModel, PredictionModel as Prediction } from '../../src/db/models/prediction.model';

import { ScorePoints } from '../../src/common/score'
import { PredictionRepository } from '../../src/db/repositories/prediction.repo';

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

describe('Prediction Repo', function (){
  this.timeout(5000);
  before(done => {
    db.init(config.testDb.uri, done, { drop: true });
  })
  beforeEach(done => {
    User.create([chalo, kagiri])
      .then(users => { 
        user1 = users[0]; user2 = users[1];
        return League.create(epl)
      })
      .then(l => {
        league = l;
        let { name, slug, id } = l;
        epl17.league = { name, slug, id };
        return Season.create(epl17);
      })
      .then(s => {
        season = s;
        return Team.create([manu, manc, che, ars])
      })
      .then(teams => {
        team1 = teams[0]; team2 = teams[1]; 
        team3 = teams[2]; team4 = teams[3];
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
        
        return Fixture.create([manuVmanc, cheVars])
      })
      .then(fixtures => {
        fixture1 = fixtures[0];
        fixture2 = fixtures[1];        
        done();
      })
  })

  afterEach(done => { 
    db.drop().then(() => { done(); })
  })
  after(done => {
    db.close().then(() => { done(); })
  })

  describe('findOrCreate joker', () => {
    it('should create joker if it doesnt exist', done => {
     predictionRepo.findOrCreateJoker$(user1.id, season.id, season.currentGameRound, [fixture1.id])
      .subscribe(p => {
        expect(p).to.have.property('hasJoker', true)
        expect(p).to.have.property('jokerAutoPicked', true)
        done();
      })
    })      
  })

  it('should findOne prediction by user and fixture', done => {
    let prediction: IPrediction;
    let { slug: fixtureSlug, season, gameRound, odds, id: fixtureId } = fixture1;
    let pred = { 
      user: user1.id, fixture: fixtureId, fixtureSlug, season, gameRound, 
      choice: { goalsHomeTeam: 0, goalsAwayTeam: 0, isComputerGenerated: true }
    }
    Prediction.create(pred)
      .then((p) => {
        prediction = p;
        return predictionRepo.findOne$({ userId: user1.id, fixtureId: fixture1.id }).toPromise()
      })
      .then(p => {
        expect(p.id).to.equal(prediction.id);
        done();        
      })
  })

  describe('findOneOrCreate prediction', () => {
    it('should create prediction if it doesnt exist', done => {
      predictionRepo.findOneOrCreate$({ userId: user1.id, fixtureId: fixture1.id })
        .subscribe(p => {     
          expect(p.user.toString()).to.equal(user1.id)
          expect(p.fixture.toString()).to.equal(fixture1.id)    
          expect(p.fixtureSlug).to.equal(fixture1.slug) 
          expect(p).to.have.property('hasJoker', false)
          expect(p).to.have.property('jokerAutoPicked', false) 
          done()
        })

    })    
    it('should return existing prediction', done => {
      let prediction: IPredictionModel;
      predictionRepo.findOneOrCreate$({ userId: user1.id, fixtureId: fixture1.id })
        .flatMap(p => {
          prediction = p as IPredictionModel;
          return predictionRepo.findOneOrCreate$({ userId: user1.id, fixtureId: fixture1.id })
        })
        .subscribe((p: IPredictionModel) => {     
          expect(p.toObject()).to.eql(prediction.toObject())
          done()
        })
    })
  })

  it('should findById And update score', done => {
    let scorePoints: ScorePoints;
    predictionRepo.findOneOrCreate$({ userId: user1.id, fixtureId: fixture1.id })
    .flatMap(p => {
      scorePoints = {
        points: 7,
        APoints: 7,
        BPoints: 0,
        MatchOutcomePoints: 4,  
        TeamScorePlusPoints: 3,
        GoalDifferencePoints: 0,
        ExactScorePoints: 0,
        TeamScoreMinusPoints: 0
      }
      return predictionRepo.findByIdAndUpdate$(p.id, { scorePoints})
    })
    .subscribe((p: IPredictionModel) => {
      let pred = p.toObject() as IPrediction;
      expect(pred.scorePoints).to.eql(scorePoints)
      done();
    })
  })
})
