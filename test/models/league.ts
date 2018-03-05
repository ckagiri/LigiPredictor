import { expect } from 'chai';

import { ILeague, League } from '../../src/db/models/league';

describe.only('League', () => {
  describe('schema', () => {

    describe('an empty league', () => {
      const l = new League();

      it('should have a mongoose schema', function(){
        expect(l.schema).not.be.undefined
      });

      it('should require a name', (done) => {
        l.validate((err) => {
          expect(err.errors.name).to.exist;
          done();
        })
      })

      it('should require a slug', (done) => {
        l.validate((err) => {
          expect(err.errors.slug).to.exist;
          done();
        })
      })

      it('should not require a code', (done) => {
        l.validate((err) => {
          expect(err.errors.code).to.not.exist;
          done();
        })
      });
    })

    describe('a full league', () => {
      const n: ILeague = {
        name: 'English Premier League',
        slug: 'english_premier_league',
        code: 'epl'
      };
      const l = new League(n);
      it('should have 0 errors', (done) => {
        l.validate((err) => {
          expect(err).to.eql(null);
          done();
        });
      });
    });
  })
})