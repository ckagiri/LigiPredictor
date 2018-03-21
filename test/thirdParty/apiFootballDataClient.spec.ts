import { expect } from 'chai';
import * as mockery from 'mockery';
import * as fs from 'fs';
import * as sinon from 'sinon';

import { FootballApiClient } from '../../src/thirdParty/footballApi/apiClient';
import { FootballApiProvider as ApiProvider } from '../../src/common/footballApiProvider';

describe.only('apifootballDataClient', () => {
  before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })
  });
  beforeEach(()=> {
    mockery.registerAllowable();
  })
  afterEach(() => {
    mockery.deregisterAll();
  })
  after(() => {
    mockery.disable();
  });
  describe('getCompetitions', () => {
    it('should get real competitions by year', async () => {
      let apiClient = FootballApiClient.getInstance(ApiProvider.API_FOOTBALL_DATA);
      const response = await apiClient.getCompetitions(2017);
      expect(response.data).to.be.an('array');
      expect(response.metadata).to.be.an('object');
    }).timeout(0);
  })
  describe('getCompetitions', () => {
    let bodyResponse = require('../fixtures/requests/apiFootballData.competitions2017');

    let response = {
      body: JSON.stringify(bodyResponse),
      headers: {         
        'x-requests-available': '49',
        'x-requestcounter-reset': '60'
      }
    }
    let requestStub = sinon.stub().returns(Promise.resolve(response));
    mockery.registerMock('request-promise', requestStub);

    it('should get competitions by year', async () => {
      let ApiFootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
      let apiFootballDataClient = ApiFootballDataClient.getInstance();
      const response = await apiFootballDataClient.getCompetitions(2015);
      expect(response.data).to.be.an('array');
      expect(response.metadata).to.be.an('object');
    })
  })
})