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

import { server as app } from '../../src/app/server';
import { LeagueModel as League } from '../../src/db/models/league.model';
import { SeasonModel as Season } from '../../src/db/models/season.model';
import { TeamModel as Team } from '../../src/db/models/team.model';

function clearData(done) {
  let promises = <any>[];
  // for (let i in mongoose.connection.collections) {
  //    promises.push(mongoose.connection.collections[i].remove(function (err) { }));
  // }
  promises.push(League.remove({}).exec(), Season.remove({}).exec(), Team.remove({}).exec())
  Promise.all(promises).then(() => done());
}

const epl = {
  name: 'English Premier League',
  slug: 'english_premier_league',
  code: 'epl'
};

function addLeague(aLeague) {
  return new Promise((resolve, reject) => {
    new League(aLeague).save((err, league) => {
      if (err) { return reject(err); }
      resolve();
    })
  })
}

describe('League API', function() {  
  this.timeout(5000);
  before(done => clearData(done))
  afterEach(done => clearData(done))
  after(done => { mongoose.disconnect(); app.close(); done() });
  
  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/v1/leagues')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) { return done(err) }
        expect(res.body).to.be.an.instanceof(Array);
        done();
      })
  })

  it('should respond with a single league', done => {
    addLeague(epl).then(() => {
      request(app)
      .get(`/api/v1/leagues/${epl.slug}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) { return done(err) }
        expect(res).to.be.json;
        done();
      })
    })
  })
})

