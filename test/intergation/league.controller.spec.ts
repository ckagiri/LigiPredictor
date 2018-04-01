import { Observable } from 'rxjs';
import * as _ from 'lodash';
import * as request from 'supertest';
import * as mongoose from 'mongoose';

import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

import { server as app } from '../../src/server';
import { LeagueModel as League } from '../../src/db/models/league.model';
import { SeasonModel as Season } from '../../src/db/models/season.model';
import { TeamModel as Team } from '../../src/db/models/team.model';

function clearData(done) {
  let promises = <any>[];
  promises.push(League.remove({}).exec(), Season.remove({}).exec(), Team.remove({}).exec());
  Promise.all(promises).then(() => done());
}

describe('League API', () => {
  // before('clearData', (done) => {
  //   let promises = <any>[];
  //   for ( let i in mongoose.connection.collections ) {
  //      promises.push( mongoose.connection.collections[ i ].remove( function (err) { } ) );
  //   }
  //   Promise.all(promises).then(() => done());
  // })
  before(done => clearData(done))
  afterEach(done => clearData(done))
  
  it('should respond with JSON array', done => {
    request(app)
  })
})

