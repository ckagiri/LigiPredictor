// import { Observable } from 'rxjs'
// import { expect } from 'chai';
// import { IUser, UserModel as User } from '../../src/db/models/user.model';
// import { UserRepository } from '../../src/db/repositories/user.repo';
// import * as db from '../../src/db/index';
// import { config } from '../../src/config/environment/index'
// let userRepo = UserRepository.getInstance();
// describe('User Repo', function() {
//   this.timeout(5000);
//   before(done => {
//     db.init(config.testDb.uri, done, { drop: true });
//   })
//   beforeEach(done => {
//     const user1: IUser = {
//       username: 'chalo',
//       email: 'chalo@example.com'
//     };
//     const user2: IUser = {
//       username: 'kagiri',
//       email: 'kagiri@example.com'
//     }
//     Promise.all([user1, user2]).then(() => done())
//   })
//   afterEach(done => { 
//     db.drop().then(() => { done(); })
//   })
//   after(done => {
//     db.close().then(() => { done(); })
//   })
//# sourceMappingURL=prediction.repo.spec.js.map