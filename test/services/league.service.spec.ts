import * as mongoose from 'mongoose';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { Observable } from 'rxjs';

import { ILeague, ILeagueModel, LeagueModel as League } from '../../src/db/models/league.model';
import { ILeagueRepository, LeagueRepository } from '../../src/db/repositories/league.repo';
import { ILeagueConverter } from '../../src/db/converters/league.converter';

import { ILeagueService, LeagueService } from '../../src/services/league.service';
import { ApiProvider } from '../../src/common/apiProvider';

const league = {
  name: 'English Premier League',
  slug: 'english_premier_league',
  code: 'epl'
};

let mockLeagueRepo: ILeagueRepository = {
  save$(obj: ILeague): Observable<ILeagueModel> {
    return Observable.create((observer) => {
      observer.next(new League(league));
      observer.complete();
    }); 
  }
}


describe('LeagueService', () => {
  let service: ILeagueService;
  before(() => {
    mongoose.connect('mongodb://localhost:27017/test123-test');
    (<any>mongoose).Promise = global.Promise;
  });
  
  after((done) => {
    League.remove({}, (err) => {
      mongoose.disconnect();
      done();
    });
  });
  
  it('should save a new league', (done) => {
    let saveSpy = sinon.spy(mockLeagueRepo, 'save$');
    service = new LeagueService(mockLeagueRepo,);
   
    service.save$(league).subscribe((obj => {
      assert.isTrue(saveSpy.calledOnce);
      assert.equal(saveSpy.firstCall.args[0].name, 'English Premier League');
      assert.equal(obj['name'], 'English Premier League');
      saveSpy.restore();
      done();
    }));   
  })

  describe('with real repo', () => {
    service = LeagueService.getInstance(ApiProvider.LIGI);
    
    it('should really save a new league', (done) => {
      service.save$(league).subscribe(l => {
        assert.notEqual(l._id, undefined);
        assert.equal(l.name, league.name);
        assert.equal(l.slug, league.slug);
        assert.equal(l.code, league.code);
  
        done();
      });
    })
  })  
})