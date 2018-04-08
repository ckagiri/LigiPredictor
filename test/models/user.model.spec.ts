import { expect } from 'chai';

import { UserModel as User } from '../../src/db/models/user.model';

describe.only('Users', () => {
  describe('schema', () => {
    describe('an empty user', () => {
      const u = new User();
      it('should have 1 mandatory property', (done) => {
        u.validate((err) => {
          expect(Object.keys(err.errors)).to.have.lengthOf(1);
          done();
        });
      });
  
      it('should require an email', (done) => {
        u.validate((err) => {
          expect(err.errors.email).to.exist;
          done();
        });
      });
    })
  })
})