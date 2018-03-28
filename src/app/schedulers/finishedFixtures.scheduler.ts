import { EventEmitter } from 'events';
import { ITaskRunner, TaskRunner } from './taskRunner';
import { IEventMediator, EventMediator } from '../../common/eventMediator';
import { IFinishedFixturesProcessor, FinishedFixturesProcessor} from './finishedFixtures.processor';
import { IScheduler } from '../schedulers';

export class FinishedFixturesScheduler extends EventEmitter implements IScheduler {
  private _processing = false;
  private _running = false;
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
    return this._running;
  }

  get IsProcessing() {
    return this._processing;
  }

  start = async () => {
    this._running = true;
    while(this._running) {
      await this.taskRunner.run({
        whenToExecute: this.RUN_INTERVAL,
        context: this,
        task: async () => {
          await Promise.resolve(); //processFinishedFixtures;
          this.emit('task:executed')               
        }
      })
    }
  }

  stop = async () => {
    await Promise.resolve().then(() => {
      this._running = false      
      this.emit('stopped')
    })
  }

  processFinishedFixtures = () => {
    // if _processing return
    // let fs = await fixtureRepo.findFinishedWithPendingPredictions$();
    // await processPredictions(fs);
  }

  processPredictions = async (finishedFixtures: any[]) => {
    if(Array.isArray(finishedFixtures) && finishedFixtures.length) {
      await this.finishedFixturesProcessor.processPredictions(finishedFixtures);
      //await leaderboardProcessor.processRankigs()
      //await finishedFixturesProcessor.setToTrueAllPredictionsProcessed(fixtures)
    }
    this.eventMediator.publish('predictions:processed')
  }
}