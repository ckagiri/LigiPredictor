import { EventEmitter } from 'events';
let Moment = require('moment');

import { IFootballApiScheduler } from '../../footballApi';
import { ITaskRunner, TaskRunner } from '../../taskRunner';
import { IFootballApiClient, FootballApiClient as ApiClient } from '../../../../thirdParty/footballApi/apiClient';
import { FootballApiProvider as ApiProvider } from '../../../../common/footballApiProvider';
import { IEventEmitter } from '../../../../common/eventEmitter';
import { IFixturesUpdater, FixturesUpdater } from '../processors/fixtures.updater';
import { IFinishedFixturesProcessor, FinishedFixturesProcessor } from '../processors/finishedFixtures.processor'

export class FixturesScheduler extends EventEmitter implements IFootballApiScheduler {
  static getInstance(provider: ApiProvider) {
    return new FixturesScheduler(
      new TaskRunner(), 
      ApiClient.getInstance(provider),
      FixturesUpdater.getInstance(provider),
      FinishedFixturesProcessor.getInstance()
    );
  }

  private _nextUpdate = 0;
  private _previousUpdate = 0;
  private _polling = false;

  constructor(
    private taskRunner: ITaskRunner, 
    private apiClient: IFootballApiClient, 
    private fixturesUpdater: IFixturesUpdater,
    private finishedFixturesUpdater: IFinishedFixturesProcessor) {
      super();
      this.on('process:fixtures', this.processFixtures)
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
            let tommorowsFixtures = await this.apiClient.getTomorrowsFixtures();
            let yesterdaysFixtures = await this.apiClient.getYesterdaysFixtures();
            fixtures = [].concat(...[tommorowsFixtures, yesterdaysFixtures])
          } 
          let todaysFixtures = await this.apiClient.getTodaysFixtures();          
          fixtures = fixtures.concat(todaysFixtures)
          let changedDbFixtures = await this.fixturesUpdater.updateFixtures(fixtures)
          this._previousUpdate = this._nextUpdate
          this._nextUpdate = this.calculateNextUpdate(fixtures)
          this.emit('process:fixtures', changedDbFixtures)
          this.onTaskExecuted();          
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

  onTaskExecuted = () => {
    this.emit('task:executed')
  }

  calculateNextUpdate = (fixtures: any[]) => {
    return 10*60*60*1000;
  }

  processFixtures = async (changedDbFixtures: any[]) => {
    await Promise.resolve();
  }
}
