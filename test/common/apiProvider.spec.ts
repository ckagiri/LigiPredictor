import { assert, expect } from 'chai';
import { FootballApiProvider as ApiProvider} from '../../src/common/footballApiProvider'

describe('ApiProvider', () => {
  describe('Choice', () => {
    it('should return ApiProvider Type', () => {
      expect(ApiProvider.API_FOOTBALL_DATA).is.an.instanceof(ApiProvider);
    })
    it('should return correct string representation' ,() => {
      expect(ApiProvider.API_FOOTBALL_DATA.toString()).to.equal('API_FOOTBALL_DATA')
    })
    it('should do equality checks' ,() => {
      expect(ApiProvider.API_FOOTBALL_DATA.equals(ApiProvider.API_FOOTBALL_DATA)).to.be.true     
      expect(ApiProvider.API_FOOTBALL_DATA.equals(ApiProvider.LIGI)).to.be.false     
    })
  })
})