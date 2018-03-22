import { expect } from 'chai';

import { ISeason, SeasonModel as Season } from '../../src/db/models/season.model';

describe('Season', () => {
  describe('schema', () => {

    describe('an empty season', () => {
      const s = new Season();

      it('should have a mongoose schema', function(){
        expect(s.schema).to.not.be.undefined
      });

      it('should require a name', (done) => {
        s.validate((err) => {
          expect(err.errors.name).to.exist;
          done();
        })
      })

      it('should require a slug', (done) => {
        s.validate((err) => {
          expect(err.errors.slug).to.exist;
          done();
        })
      })

      it('should not require a code', (done) => {
        s.validate((err) => {
          expect(err.errors.code).to.not.exist;
          done();
        }) 
      });
    })
  })
})