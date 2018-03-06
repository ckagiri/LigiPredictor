import * as mongoose from 'mongoose';
import { assert } from 'chai';

import { LeagueModel as League } from '../../src/db/models/league.model';
import { LeagueRepository } from '../../src/db/repositories/league.repo';
import { LeagueConverter } from '../../src/db/converters/league.converter';

import { LeagueService } from '../../src/db/services/league.service';

describe('LeagueService', () => {
  let service: LeagueService;
  before(() => {
    mongoose.connect('mongodb://localhost:27017/test123-test');
    (<any>mongoose).Promise = global.Promise;

    service = new LeagueService(LeagueRepository.getInstance(), LeagueConverter.getInstance());
  });
  
  after((done) => {
    League.remove({}, (err) => {
      mongoose.disconnect();
      done();
    });
  });

  it('should save a new league', (done) => {
    const league = {
      name: 'English Premier League',
      slug: 'english_premier_league',
      code: 'epl'
    };

    service.save$(league).subscribe(l => {
      assert.notEqual(l._id, undefined);
      assert.equal(l.name, league.name);
      assert.equal(l.slug, league.slug);
      assert.equal(l.code, league.code);

      done();
    });
  })
})