import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';

import { SeasonUpdater } from '../../../src/app/schedulers/footballApi/season.updater'
import { FootballApiProvider as ApiProvider } from '../../../src/common/footballApiProvider'

let provider = ApiProvider.API_FOOTBALL_DATA;
let newSeason = () => { 
  return { 
    currentMatchRound: 1,
    id: 1 
  }
}
let dbSeason = newSeason();
let apiSeason = newSeason();
apiSeason.currentMatchRound = 2;
let dbSeasons = [dbSeason]
let apiSeasons = [apiSeason]
let seasonRepoStub:any = {
  provider,
  findByIdAndUpdate$: () => {},
  getByExternalIds$: () => {
    return Observable.of(apiSeasons);
  }
}
let seasonUpdater = new SeasonUpdater(seasonRepoStub);

describe.only('SeasonUpdater', () => {  
  describe('updateCurrentMatchRound', () => {    
    it('should get seasons by externalId', async () => {
      let spy = sinon.spy(seasonRepoStub, 'getByExternalIds$')
      await seasonUpdater.updateCurrentMatchRound(apiSeasons);
      let externalIds = [].map.call(apiSeasons, n => n.id);     
      expect(spy).to.have.been.calledOnce
        .and.to.have.been.calledWith(sinon.match.array)
        .and.to.have.been.calledWith(sinon.match(externalIds));
    })
    it('should update currentRound of season if different from stored', () => {

    })
    it('should not update currentRound if similar', () => {
      
    })
  })
})