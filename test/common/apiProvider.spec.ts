import { assert, expect } from 'chai';
import { FootballApiProvider as ApiProvider} from '../../src/common/footballApiProvider'

describe('ApiProvider', () => {
  describe('Choice', () => {
    it('should return correct string representation' ,() => {
      expect(ApiProvider.API_FOOTBALL_DATA.toString()).to.equal('API_FOOTBALL_DATA')
    })
  })
})