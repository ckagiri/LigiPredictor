// import * as mocha from 'mocha';
// import * as chai from 'chai';
// import chaiHttp = require('chai-http');

// import * as mongoose from 'mongoose';
// import { server as app } from '../../src/app/server'; 


// before((done) => {
//   mongoose.connection.collections['user2017'].drop((dropUserErr) => {
//     if (dropUserErr && !(dropUserErr.message === 'ns not found')) {
//       throw dropUserErr;
//     }
//     done();
//   });
// });

// describe('register route', () => {
//   it('should register a new user', () => {
//     const name = randomString(20);
//     const password = randomString(32);
//     const email = `${name}@example.com`;
//     const user = { name, email, password };
//     return chai.request(express).post('/v2/auth/register')
//     .send(user)
//     .catch((err) => {
//       expect(err).to.be.empty;
//     })
//     .then((res) => {
//       expect(res.type).to.eql('application/json');
//       expect(res.body).to.not.be.empty;
//       expect(res.body.token).to.not.be.empty;
//       expect(res.body.user).to.not.be.empty;
//       expect(res.body.user._id).to.not.be.empty;
//       expect(res.body.user).to.have.property('name', name);
//     });
//   });