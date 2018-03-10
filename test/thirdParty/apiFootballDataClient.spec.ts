import { expect } from 'chai';
import { ApifootballDataClient } from '../../src/thirdParty/footballApi/apiFootballData/apiClient';

describe.only('apifootballDataClient', () => {
  let apifootballDataClient;
  before(() => {
    apifootballDataClient = ApifootballDataClient.getInstance();
  });
  describe('getCompetitions', () => {
    it('should get competitions by year', async () => {
      const response = await apifootballDataClient.getCompetitions(2017);
      expect(response.data).to.be.an('array');
      expect(response.metadata).to.be.an('object');
    }).timeout(0);
  })
})