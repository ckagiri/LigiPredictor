import * as mongoose from 'mongoose';
import { assert } from 'chai';

import { LeagueModel as League } from '../../src/db/models/league.model';
import { LeagueRepository } from '../../src/db/repositories/league.repo';

describe('LeagueRepo', () => {
  let repo: LeagueRepository;
  before(() => {
    mongoose.connect('mongodb://localhost:27017/test123-test');
    (<any>mongoose).Promise = global.Promise;

    repo = new LeagueRepository();
  });
  
  after((done) => {
    League.remove({}, (err) => {
      mongoose.disconnect();
      done();
    });
  });

  describe('save$', () => {
    it('should save a new league', (done) => {
      const league = {
        name: 'English Premier League',
        slug: 'english_premier_league',
        code: 'epl'
      };

      repo.save$(league).subscribe(l => {
        assert.notEqual(l._id, undefined);
        assert.equal(l.name, league.name);
        assert.equal(l.slug, league.slug);
        assert.equal(l.code, league.code);

        done();
      });
    })
  })
})