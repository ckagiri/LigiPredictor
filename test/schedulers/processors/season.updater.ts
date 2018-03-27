import { SeasonUpdater } from '../../../src/app/schedulers/footballApi/season.updater'
import { FootballApiProvider as ApiProvider } from '../../../src/common/footballApiProvider'
let seasonRepoStub:any = {
  provider: ApiProvider.API_FOOTBALL_DATA,
  findByIdAndUpdate$: () => {},
  getByExternalId$: () => {}
}
let newSeason = () => { 
  return { 
    currentMatchRound: 1,
    externalReference: {
      [ApiProvider.API_FOOTBALL_DATA]: { id: 1 }
    }
  }
}
let dbSeason = newSeason();
let apiSeason = newSeason();
apiSeason.currentMatchRound = 2;
let dbSeasons = [dbSeason]
let apiSeasons = [apiSeason]
let seasonUpdater = new SeasonUpdater(seasonRepoStub);
describe('SeasonUpdater', () => {
  
  describe('updateCurrentMatchRound', () => {
    //seasonUpdater.updateCurrentMatchRound(apiSeasons)
    
    it('should get seasons by externalId', () => {

    })
    it('should update currentRound of season if different from stored', () => {

    })
    it('should not update currentRound if similar', () => {
      
    })
  })
})