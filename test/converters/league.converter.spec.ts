import { Observable } from 'rxjs';
import { expect, assert } from 'chai';

import { ILeagueConverter } from '../../src/db/converters/league.converter';
import { LigiLeagueConverter} from '../../src/db/converters/ligi/league.converter';

describe('League Converter', () => {
  let converter: ILeagueConverter;
  let afdLeague;
  before(() => {
    afdLeague = {
      name: 'English Premier League',
      slug: 'english_premier_league',
      code: 'epl'
    };
  });

  describe('Ligi Converter', () => {
    converter = new LigiLeagueConverter();
    
    it('should return an observable when converting', () => {
      let conversion = converter.from({});
      expect(conversion instanceof Observable).to.equal(true);
    });

    it('should convert correctly', (done) => {
      let conversion = converter.from(afdLeague);
      conversion.subscribe(l => {
        assert.equal(l.name, afdLeague.name);
        assert.equal(l.slug, afdLeague.slug);
        assert.equal(l.code, afdLeague.code);

        done();
      });
    })
  })
})