import { EventEmitter } from 'events';
import { IFootballApiScheduler } from '../../footballApi';
import { ITaskRunner, TaskRunner } from '../../taskRunner';
import { IFootballApiClient, FootballApiClient as ApiClient } from '../../../../thirdParty/footballApi/apiClient';
import { FootballApiProvider as ApiProvider } from '../../../../common/footballApiProvider';
import { IEventEmitter } from '../../../../common/eventEmitter';
import { ISeasonUpdater, SeasonUpdater } from '../processors/season.updater';

export class SeasonScheduler extends EventEmitter implements IFootballApiScheduler {
  static getInstance(provider: ApiProvider) {
    return new SeasonScheduler(
      new TaskRunner(), 
      ApiClient.getInstance(provider),
      SeasonUpdater.getInstance(provider)
    );
  }
  private POLLING_INTERVAL = 24 * 60 * 60 * 1000;
  private _pollingInterval = 0;
  private _polling = false;

  constructor(
    private taskRunner: ITaskRunner, 
    private apiClient: IFootballApiClient, 
    private seasonUpdater: ISeasonUpdater) {
      super();
  }

  get IsPolling() {
    return this._polling;
  }

  get PollingInterval() {
    return this._pollingInterval;
  }
  
  start = async () => {
    this._polling = true;
    while(this._polling) {
      await this.taskRunner.run({
        whenToExecute: this._pollingInterval,
        context: this,
        task: async () => {
          let competitions = await this.apiClient.getCompetitions(2017);
          await this.seasonUpdater.updateCurrentMatchRound(competitions);
          this._pollingInterval = this.POLLING_INTERVAL;
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
}