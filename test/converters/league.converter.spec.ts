import { Observable } from 'rxjs';
import { expect, assert } from 'chai';

import { LeagueConverter } from '../../src/db/converters/league.converter';
import { LigiLeagueConverter} from '../../src/db/converters/league.converter.ligi';

describe('League Converter', () => {
  let converter: LeagueConverter;
  let afdLeague;
  before(() => {
    converter = new LigiLeagueConverter();
    afdLeague = {
      name: 'English Premier League',
      slug: 'english_premier_league',
      code: 'epl'
    };
  });

  it('should return an observable when converting', () => {
    let conversion = converter.convert({});
    expect(conversion instanceof Observable).to.equal(true);
  });

  it('should convert correctly', (done) => {
    let conversion = converter.convert(afdLeague);
    conversion.subscribe((l) => {
      assert.equal(l.name, afdLeague.name);
      assert.equal(l.slug, afdLeague.slug);
      assert.equal(l.code, afdLeague.code);

      done();
    });
  })
})