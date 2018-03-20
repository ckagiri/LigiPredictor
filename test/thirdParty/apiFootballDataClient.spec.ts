import { expect } from 'chai';
import * as mockery from 'mockery';
import * as fs from 'fs';
import * as sinon from 'sinon';

//import { ApifootballDataClient } from '../../src/thirdParty/footballApi/apiFootballData/apiClient';

describe('apifootballDataClient', () => {
  let apifootballDataClient;
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
  describe.skip('getCompetitions', () => {
    it('should get competitions by year', async () => {
      const response = await apifootballDataClient.getCompetitions(2017);
      expect(response.data).to.be.an('array');
      expect(response.metadata).to.be.an('object');
    }).timeout(0);
  })
  describe('getCompetions', () => {
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
      let apifootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
      const response = await apifootballDataClient.getCompetitions(2015);
      expect(response.data).to.be.an('array');
      expect(response.metadata).to.be.an('object');
    })
  })
})