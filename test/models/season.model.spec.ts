import { expect } from 'chai';

import { SeasonModel as Season } from '../../src/db/models/season.model';

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

      it('should require year', (done) => {
        s.validate((err) => {
          expect(err.errors.year).to.exist;
          done();
        })
      })

      it('should require partial league info', (done) => {
        s.validate((err) => {
          expect(err.errors['league.id']).to.exist;
          done();
        })
      })
    })

    describe('a partial season', () => {
      const season = {
        name: '2017-2018',
        slug: '17-18',
        year: 2017,
        league: {
          name: 'English Premier League',
          slug: 'english_premier_league',
          id: '4edd40c86762e0fb12000003'
        }
      };
      const s = new Season(season);
      it('should have 0 errors', (done) => {
        s.validate((err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  })
})