import { EventEmitter } from 'events';
import { ITaskRunner, TaskRunner } from './taskRunner';
import { IEventMediator, EventMediator } from '../../common/eventMediator';
import { IFinishedFixturesProcessor, FinishedFixturesProcessor} from './finishedFixtures.processor';
import { IScheduler } from '../schedulers';

export class FinishedFixturesScheduler extends EventEmitter implements IScheduler {
  private _isProcessing = false;
  private _isRunning = false;
  private RUN_INTERVAL = 10 * 60 * 60 * 1000;
  constructor(
    private taskRunner: ITaskRunner,
    private finishedFixturesProcessor: IFinishedFixturesProcessor,
    private eventMediator: IEventMediator
  ) {
    super();
    this.eventMediator.addListener('process:predictions', this.processPredictions)    
  }

  get IsRunning() {
    return this._isProcessing;
  }

  start = async () => {
    this._isRunning = true;
    while(this._isRunning) {
      await this.taskRunner.run({
        whenToExecute: this.RUN_INTERVAL,
        context: this,
        task: async () => {
          await Promise.resolve();
        }
      })
    }
  }

  stop = async () => {
    await Promise.resolve().then(() => {
      this._isRunning = false
      this.emit('stopped')
    })
  }

  processPredictions = async (finishedFixtures: any[]) => {
    await this.finishedFixturesProcessor.processPredictions(finishedFixtures)
    this.emit('predictions:processed')
  }
}