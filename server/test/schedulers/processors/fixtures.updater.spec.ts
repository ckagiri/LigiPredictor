import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;

import { Observable } from 'rxjs';
import { FootballApiProvider as ApiProvider } from '../../../src/common/footballApiProvider'
import { FixtureStatus } from '../../../src/db/models/fixture.model';
import { IFixturesUpdater, FixturesUpdater } from '../../../src/app/schedulers/footballApi/fixtures.updater'

let provider = ApiProvider.API_FOOTBALL_DATA;
let newApiFixture = () => { 
  return { 
    id: 1,     
    status: FixtureStatus.FINISHED,
    result: {
      goalsHomeTeam: 1,
      goalsAwayTeam: 1
    },
    odds: null
  }
}
let newDbFixture = () => { 
  return { 
    id: ObjectId().toHexString(),
    status: FixtureStatus.SCHEDULED,
    externalReference: { [provider]: { id: 1 } }
  }
}

let dbFixture = newDbFixture();
let apiFixture = newApiFixture();
let dbFixtures = [dbFixture]
let apiFixtures = [apiFixture]

let fixtureRepoStub: any;
let fixturesUpdater: IFixturesUpdater;


let newFixture = (id, homeTeam, awayTeam, status = FixtureStatus.FINISHED) => { 
  return {
    homeTeam, awayTeam, status, 
    externalReference: {
      [ApiProvider.API_FOOTBALL_DATA]: { id }
    }
  }
}

describe('FixturesUpdater', () => {
  beforeEach(() => {
    fixtureRepoStub = {
      Provider: provider,
      findByIdAndUpdate$: () => { return Observable.of(dbFixture) },
      findByExternalIds$: () => {
        return Observable.of(dbFixtures);
      }
    }
    fixturesUpdater = new FixturesUpdater(fixtureRepoStub);
  })

  describe('Update Game Details', () => {
    it('should update matchResult if changed', async () => {
      let spy = sinon.spy(fixtureRepoStub, 'findByIdAndUpdate$');      
      
      let res = await fixturesUpdater.updateGameDetails(apiFixtures);
    
      expect(spy).to.have.been.calledOnce;
          
      expect(spy).to.have.been.calledWithMatch(dbFixture.id, { result: apiFixture.result, status: apiFixture.status });  

      fixtureRepoStub.findByIdAndUpdate$.restore();
    })

    xit('should update matchOdds if changed', () => {

    })

    xit('should update matchStatus if changed', () => {

    })

    xit('it should not make update call if result, odds or status hasnt changed')
  })
})