import { Observable } from 'rxjs';
import * as sinon from 'sinon';
import { expect } from 'chai';

import { IFixtureConverter } from '../../src/db/converters/fixture.converter';
import { FixtureConverter as LigiFixtureConverter} from '../../src/db/converters/ligi/fixture.converter';
import { FixtureConverter as AfdFixtureConverter} from '../../src/db/converters/apiFootballData/fixture.converter';
import { FixtureStatus } from '../../src/db/models/fixture.model';

describe('Fixture Converter', function() {
  describe('Afd FixtureConverter', function() {
    let season = {
      _id: '4edd40c86762e0fb12000001'
    }
    let seasonRepoStub:any = {
      findByExternalId$: () => {
        return Observable.of(season);
      }
    }
    let homeTeam = {
      _id: '4edd40c86762e0fb12000001',
      name: 'Arsenal',
      slug: 'arsenal',
      crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Arsenal_FC.svg'
    }
    let awayTeam = {
      _id: '4edd40c86762e0fb12000002',
      name: 'Chelsea',
      slug: 'chelsea',
      crestUrl: 'http://upload.wikimedia.org/wikipedia/de/d/da/Chelsea.svg'
    }
    let teamRepoStub:any = {
      findByName$: sinon.stub()
    }
    teamRepoStub.findByName$.withArgs(sinon.match('Arsenal')).returns(Observable.of(homeTeam));
    teamRepoStub.findByName$.withArgs(sinon.match('Chelsea')).returns(Observable.of(awayTeam));
    const converter = new AfdFixtureConverter(seasonRepoStub, teamRepoStub);
    const fixture = {
        id: 158952,
        competitionId: 445,
        date: '2018-05-13T14:00:00Z',
        status: 'SCHEDULED',
        matchday: 38,
        homeTeamName: 'Arsenal',
        homeTeamId: 340,
        awayTeamName: 'Chelsea',
        awayTeamId: 65,
        result: {
          goalsHomeTeam: null,
          goalsAwayTeam: null
        },
        odds: null
    }
    it('should convert correctly', (done) => {
      let conversion = converter.from(fixture);
      conversion.subscribe(f => {
        expect(f.homeTeam.name).to.equal(homeTeam.name);
        expect(f.awayTeam.name).to.equal(awayTeam.name);
        expect(f.matchRound).to.equal(fixture.matchday);
        expect(f.slug).to.equal( `${homeTeam.slug}-${awayTeam.slug}`);
        expect(f.externalReference).to.deep.equal({ API_FOOTBALL_DATA: { id: 158952 } })
        
        done();
      });
    })
  })
})