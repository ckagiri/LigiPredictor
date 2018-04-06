import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';

import { SeasonUpdater } from '../../../src/app/schedulers/footballApi/season.updater'
import { FootballApiProvider as ApiProvider } from '../../../src/common/footballApiProvider'

let provider = ApiProvider.API_FOOTBALL_DATA;
let newDbSeason = () => { 
  return { 
    _id: 'a',
    currentMatchRound: 1,
    externalReference: {
      [provider]: { id: 1
      }
    }
  }
}
let newApiSeason = () => { 
  return { 
    id: 1,     
    currentMatchRound: 2,
  }
}
let dbSeason = newDbSeason();
let apiSeason = newApiSeason();
let dbSeasons = [dbSeason]
let apiSeasons = [apiSeason]

let seasonConverterStub: any;
let seasonRepoStub: any;
let seasonUpdater: any;

describe('SeasonUpdater', () => {  
  beforeEach(() => {
    seasonConverterStub = {
      provider,
      from: () => {}
    }
    seasonRepoStub = {
      Provider: provider,
      findByIdAndUpdate$: () => { return Observable.of(dbSeason) },
      findByExternalIds$: () => {
        return Observable.of(dbSeasons);
      }
    }
    seasonUpdater = new SeasonUpdater(seasonRepoStub);
  })

  describe('updateCurrentMatchRound', () => {    
    it('should get seasons by externalId', async () => {
      let spy = sinon.spy(seasonRepoStub, 'findByExternalIds$')

      await seasonUpdater.updateCurrentMatchRound(apiSeasons);
      let externalIds = [].map.call(apiSeasons, n => n.id);     
      expect(spy).to.have.been.calledOnce
        .and.to.have.been.calledWith(sinon.match(externalIds));
    })
    it('should update currentRound of season if different from stored', async () => {
      let spy = sinon.spy(seasonRepoStub, 'findByIdAndUpdate$');      
  
      let res = await seasonUpdater.updateCurrentMatchRound(apiSeasons);

      expect(spy).to.have.been.calledOnce;
      
      expect(spy).to.have.been.calledWith(sinon.match(dbSeason._id))      
    })
    it('should not update currentRound if similar', async () => {
      let apiSeason = newApiSeason();
      apiSeason.currentMatchRound = 1;
      let spy = sinon.spy(seasonRepoStub, 'findByIdAndUpdate$');      

      await seasonUpdater.updateCurrentMatchRound([apiSeason]);

      expect(spy).not.to.have.been.called;
    })
  })
})