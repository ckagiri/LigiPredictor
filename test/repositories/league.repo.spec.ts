import * as mongoose from 'mongoose';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { Observable } from 'rxjs';

import { ILeague, LeagueModel as League } from '../../src/db/models/league.model';
import { ILeagueRepository, LeagueRepository } from '../../src/db/repositories/league.repo';
import { ILeagueConverter } from '../../src/db/converters/league.converter';
import { FootballApiProvider as ApiProvider } from '../../src/common/footballApiProvider';

const league = {
  name: 'English Premier League',
  slug: 'english_premier_league',
  code: 'epl'
};

let mockLeagueRepo = {
  save$(obj: ILeague): Observable<ILeague> {
    return Observable.create((observer) => {
      observer.next(new League(league));
      observer.complete();
    }); 
  },
  findByExternalIdAndUpdate$(obj: ILeague): Observable<ILeague> {
    return Observable.of(new League());
  }  
}

describe('LeagueRepo', () => {
  before((done) => {
    (<any>mongoose).Promise = global.Promise;    
    mongoose.connect('mongodb://localhost:27017/test123-test');
    mongoose.connection
    .once('open', () => done())
    .on('error', (error) => {
      console.warn('Error', error);
    })
  });
  
  after((done) => {
    League.remove({}, (err) => {
      mongoose.disconnect();
      done();
    });
  });
  
  it('should save a new league', (done) => {
    let saveSpy = sinon.spy(mockLeagueRepo, 'save$');
    let repo = mockLeagueRepo;
   
    repo.save$(league).subscribe((obj => {
      assert.isTrue(saveSpy.calledOnce);
      assert.equal(saveSpy.firstCall.args[0].name, 'English Premier League');
      assert.equal(obj['name'], 'English Premier League');
      saveSpy.restore();
      done();
    }));   
  })

  describe('with real repo', () => {
    let repo = LeagueRepository.getInstance(ApiProvider.LIGI);
    
    it('should save a new league', (done) => {
      repo.save$(league).subscribe(l => {
        assert.notEqual(l['_id'], undefined);
        assert.equal(l.name, league.name);
        assert.equal(l.slug, league.slug);
        assert.equal(l.code, league.code);
  
        done();
      });
    })
  })  
})