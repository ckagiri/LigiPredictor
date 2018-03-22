import { expect } from 'chai';
import * as mockery from 'mockery';
import * as fs from 'fs';
import * as sinon from 'sinon';

import { FootballApiClient, IFootballApiClient } from '../../src/thirdParty/footballApi/apiClient';
import { FootballApiProvider as ApiProvider } from '../../src/common/footballApiProvider';

describe.only('apifootballDataClient', () => {
  describe('getCompetitions', () => {
    before(() => {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      })
    });
    after(() => {
      mockery.disable();
    });
    it('should get real competitions by year', async () => {
      let apiClient = FootballApiClient.getInstance(ApiProvider.API_FOOTBALL_DATA);
      const response = await apiClient.getCompetitions(2017);
      expect(response.data).to.be.an('array');
      expect(response.metadata).to.be.an('object');
    }).timeout(0);   

    it('should get competitions by year', async () => {
      let competitions = require('../fixtures/requests/apiFootballData.competitions2017');
      let response = {
        body: JSON.stringify(competitions),
        headers: {         
          'x-requests-available': '49',
          'x-requestcounter-reset': '60'
        }
      }
      let requestStub = sinon.stub().returns(Promise.resolve(response));
      mockery.registerMock('request-promise', requestStub);

      let ApiFootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
      let apiFootballDataClient: IFootballApiClient = ApiFootballDataClient.getInstance();
      const {data, metadata} = await apiFootballDataClient.getCompetitions(2017);

      expect(data).to.be.an('array');
      expect(metadata).to.be.an('object');
    })
  })

  describe('getCompetition', () => {
    before(() => {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      })
    });
    after(() => {
      mockery.disable();
    });
    it('should get real competition by id', async () => {
      let apiClient = FootballApiClient.getInstance(ApiProvider.API_FOOTBALL_DATA);
      const { data, metadata } = await apiClient.getCompetition(445);
      expect(data).to.be.an('object');
      expect(metadata).to.be.an('object');
    }).timeout(0);   

    it('should get competition by id', async () => {
      let competition = require('../fixtures/requests/apiFootballData.epl2017');
      let response = {
        body: JSON.stringify(competition),
        headers: {         
          'x-requests-available': '49',
          'x-requestcounter-reset': '60'
        }
      }
      let requestStub = sinon.stub().returns(Promise.resolve(response));
      mockery.registerMock('request-promise', requestStub);

      let ApiFootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
      let apiFootballDataClient: IFootballApiClient = ApiFootballDataClient.getInstance();
      const { data, metadata} = await apiFootballDataClient.getCompetition(415);
      expect(data).to.be.an('object');
      expect(metadata).to.be.an('object');
    })      
  });

  describe('getTeams', () => {
    before(() => {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      })
    });
    after(() => {
      mockery.disable();
    });
    it('should get real teams by competition', async () => {
      let apiClient = FootballApiClient.getInstance(ApiProvider.API_FOOTBALL_DATA);
      const { data, metadata } = await apiClient.getTeams(445);
      expect(data).to.be.an('object');
      expect(metadata).to.be.an('object');     
      expect(data.count).to.be.a('number');
      expect(data.teams).to.be.an('array');
    }).timeout(0); 

    it('should get teams by competition', async () => {
      let teams = require('../fixtures/requests/apiFootballData.epl2017Teams');
      let response = {
        body: JSON.stringify(teams),
        headers: {         
          'x-requests-available': '49',
          'x-requestcounter-reset': '60'
        }
      }
      let requestStub = sinon.stub().returns(Promise.resolve(response));
      mockery.registerMock('request-promise', requestStub);

      let ApiFootballDataClient = require('../../src/thirdParty/footballApi/apiFootballData/apiClient');
      let apiFootballDataClient: IFootballApiClient = ApiFootballDataClient.getInstance();
      const { data, metadata} = await apiFootballDataClient.getTeams(415);

      expect(data).to.be.an('object');
      expect(metadata).to.be.an('object');
      expect(data.count).to.exist;
      expect(data.teams).to.be.exist;
    })
  })  
})