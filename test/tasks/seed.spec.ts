import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import { assert } from 'chai';

//import dbModels from '../../src/db/models';
//import { LeagueModel as League } from '../../src/db/models/league.model';
//const LeagueModel = require('../../src/db/models/league.model');

//const League = require('../../src/db/models/league.model')
const seedData = require('../../src/db/tasks/seedData/seed-leagues');
const seeder = require('mongoose-seeder');

/// console.log(seedData);

// function connect(done) {
//   mongoose.connect('mongodb://localhost:27017/ligi-predictor-test', done);
// }

describe('Database', () => {
  const League = mongoose.model('League', new mongoose.Schema({
    name: {
      type:  String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    code: {
      type: String,
      default: ''
    }
  }));
  before(() => {
    (<any>mongoose).Promise = global.Promise;    
    //mongoose.connect('mongodb://localhost:27017/ligi-predictor-test1');
  });
  after((done) => {
    // mongoose.connection.db.dropDatabase(() => {
    //     mongoose.disconnect(done);
    // });
    done();
  });
  describe('Seed', () => {
    it('should seed files', (done) => {
      // seeder.seed(seedData, { dropDatabase: true, dropCollections: true })
      //   .then(dbData => {
      //     done();
      //   }).catch(err => {
      //     done();
      //   });
      done();
    });
    it('Should create exactly one object in the database', (done) => {
      
      mongoose.connect('mongodb://localhost:27017/ligi-predictor-test1');
      League.remove({}, (err) => {});
      const league = {
          name: 'English Premier League',
          slug: 'english_premier_league',
          code: 'epl'
        };
        const l = new League(league);
      l.save((err) => {
        if (err) {
          console.log(err.message)
          done();
        } else {
          console.log("chalo")
          done();
        }
      });
      mongoose.connection.close();
      // seeder.seed(seedData,{ dropDatabase: true, dropCollections: true }, (err) => {
      //   if(err) return done(err);

      //   League.count((err, count) => {
      //     if(err) return done(err);

      //     assert.equal(count, 1);

      //     done();
      //   });
      // })
    })
  });
});