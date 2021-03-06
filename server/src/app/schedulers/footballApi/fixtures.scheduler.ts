import { EventEmitter } from 'events';
let moment = require('moment');

import { IScheduler } from '../../schedulers';
import { ITaskRunner, TaskRunner } from '../taskRunner';
import { IFootballApiClient, FootballApiClient as ApiClient } from '../../../thirdParty/footballApi/apiClient';
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';
import { IEventMediator, EventMediator } from '../../../common/eventMediator';
import { IFixtureConverter, FixtureConverter } from '../../../db/converters/fixture.converter';
import { IFixture, FixtureStatus } from '../../../db/models/fixture.model';

import { IFixturesUpdater, FixturesUpdater } from './fixtures.updater';

export class FixturesScheduler extends EventEmitter implements IScheduler {
  static getInstance(provider: ApiProvider) {
    return new FixturesScheduler(
      new TaskRunner(), 
      ApiClient.getInstance(provider),
      FixtureConverter.getInstance(provider),
      FixturesUpdater.getInstance(provider),
      EventMediator.getInstance()
    );
  }

  private _nextUpdate = 0;
  private _previousUpdate = 0;
  private _polling = false;

  constructor(
    private taskRunner: ITaskRunner, 
    private apiClient: IFootballApiClient, 
    private fixtureConverter: IFixtureConverter,
    private fixturesUpdater: IFixturesUpdater,
    private eventMedidatior: IEventMediator) {
      super();
  }

  get IsPolling() {
    return this._polling;
  }

  get NextUpdate() {
    return this._nextUpdate;
  }

  get PreviousUpdate() {
    return this._previousUpdate;
  }
  
  start = async () => {
    this._polling = true;
    while(this._polling) {
      await this.taskRunner.run({
        whenToExecute: this._nextUpdate,
        context: this,
        task: async () => {
          let fixtures = [];
          if(this._nextUpdate > (6 * 60 * 60 * 1000)) { // 6h
            let tommorowsFixturesRes = await this.apiClient.getTomorrowsFixtures();
            let tommorowsFixtures = this.fixtureConverter.map(tommorowsFixturesRes.data.fixtures)
            let yesterdaysFixturesRes = await this.apiClient.getYesterdaysFixtures();
            let yesterdaysFixtures = this.fixtureConverter.map(yesterdaysFixturesRes.data.fixtures)
            
            fixtures = [].concat(...[tommorowsFixtures, yesterdaysFixtures])
          } 
          let todaysFixturesRes = await this.apiClient.getTodaysFixtures();  
          let todaysFixtures = this.fixtureConverter.map(todaysFixturesRes.data.fixtures);
          
          fixtures = fixtures.concat(todaysFixtures)
          let changedDbFixtures = await this.fixturesUpdater.updateGameDetails(fixtures)
          this._previousUpdate = this._nextUpdate
          this._nextUpdate = this.calculateNextUpdate(fixtures)
          let finishedFixtures = [].filter.call(changedDbFixtures, n => n.status == FixtureStatus.FINISHED);
          this.eventMedidatior.publish('process:predictions', finishedFixtures);
          this.emit('task:executed')
        } 
      })
    }
  }

  stop = async () => {
    await Promise.resolve().then(() => {
      this._polling = false
      this.emit('stopped')
    })
  }

  calculateNextUpdate = (fixtureList: IFixture[]) => {
    let nextUpdate = moment().add(12, 'hours');
    let fixtures = fixtureList.filter(f => f.status !== FixtureStatus.FINISHED);
    let hasLiveFixture = false;
    for(let fixture of fixtures) {
      if (fixture.status == FixtureStatus.IN_PLAY) {
        hasLiveFixture = true;
      }
      if (fixture.status == FixtureStatus.SCHEDULED || fixture.status == FixtureStatus.TIMED) {
        let fixtureStart = moment(fixture.date);        
        const diff = fixtureStart.diff(moment(), 'minutes');
        if(diff <= 5) {
          hasLiveFixture = true;
        }
        if (fixtureStart.isAfter(moment()) && fixtureStart.isBefore(nextUpdate)) {
          nextUpdate = fixtureStart;
        }
      }
    }

    if(hasLiveFixture) {
      nextUpdate = moment().add(90, 'seconds');
    }
    return nextUpdate - moment();
  }
}
