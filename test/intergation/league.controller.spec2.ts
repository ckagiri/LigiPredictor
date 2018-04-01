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

// import server from "../../src/server";
// import * as supertest from "supertest";
// const agent = supertest.agent( server );

describe('League Controller', () => {
  before('clearData', (done) => {
    let promises = <any>[];
    for ( let i in mongoose.connection.collections ) {
       promises.push( mongoose.connection.collections[ i ].remove( function (err) { } ) );
    }
    Promise.all(promises).then(() => done());
  })
  // xit('bla', () => {
  //   UserModel.remove({}, (err) => {
  //     mongoose.disconnect();
  //     done();
  //   });
  // })
})

