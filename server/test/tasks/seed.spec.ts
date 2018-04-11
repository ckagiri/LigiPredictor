import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import { assert } from 'chai';

import { LeagueModel as League } from '../../src/db/models/league.model';

const seedData = require('../../src/db/tasks/seedData/seed-leagues');
const seeder = require('../../src/db/tasks/mongoose-seeder');

describe('Database', () => {
  before((done) => {
    (<any>mongoose).Promise = global.Promise;    
    mongoose.connect('mongodb://localhost:27017/ligi-predictor-test');
    mongoose.connection
      .once('open', () => done())
      .on('error', (error) => {
        console.warn('Error', error);
      })
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.disconnect(done);
    });
  });
  describe('Seed', () => {
    it('should seed files', (done) => {
      seeder.seed(seedData, { dropDatabase: true, dropCollections: true })
        .then(dbData => {
          done();
        }).catch(err => {
          done();
        });
    });
    it('Should create exactly one object in the database', (done) => {
      seeder.seed(seedData,{ dropDatabase: true, dropCollections: true }, (err) => {
        if(err) return done(err);
        League.count((err, count) => {
          if(err) return done(err);
          assert.equal(count, 1);
          done();
        });
      })
    })
  });
});