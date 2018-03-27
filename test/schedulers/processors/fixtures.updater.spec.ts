import { FootballApiProvider as ApiProvider } from '../../../src/common/footballApiProvider'
import { FixtureStatus } from '../../../src/db/models/fixture.model';

let newFixture = (id, homeTeam, awayTeam, status = FixtureStatus.FINISHED) => { 
  return {
    homeTeam, awayTeam, status, 
    externalReference: {
      [ApiProvider.API_FOOTBALL_DATA]: { id }
    }
  }
}
let fixtures = [];
let ars_che_td = newFixture(1, 'Arsenal', 'Chelsea'); 
let liv_sou_td = newFixture(2, 'Liverpool', 'Southampton');
let eve_bur_yd = newFixture(3, 'Everton', 'Burnley', FixtureStatus.POSTPONED);
let bou_wat_tm = newFixture(4, 'Bournemouth', 'Watford', FixtureStatus.SCHEDULED);

describe('FixturesUpdater', () => {
  describe('Update Game Details', () => {
    it('should update matchResult if changed', () => {

    })
    it('should update matchOdds if changed', () => {

    })
    it('should update matchStatus if changed', () => {

    })
  })
})