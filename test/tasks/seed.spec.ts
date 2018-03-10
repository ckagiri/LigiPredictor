import MongoConnection from './mongodb-connect';
process.env.NODE_ENV = 'test';
import * as mongoose from 'mongoose';

const seedData = require('../../src/db/tasks/seedData/seed-epl17');
const seeder = require('mongoose-seeder');

function connect(done) {
  mongoose.connect('mongodb://localhost/mongoose-seeder', { server: { socketOptions: { keepAlive: 1 } } }, done);
}

describe('Seed', () => {
  before(connect);
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.disconnect(done);
    });
  });
  it('should seed files', (done) => {
    seeder.seed(seedData, { dropDatabase: true, dropCollections: true })
      .then(dbData => {
        console.log(dbData);
        done();
      }).catch(err => {
        done();
      });
  });
});