import { EventEmitter } from 'events';
import * as promisify from 'util-promisify';
import { IEventEmitter } from '../../common/eventEmitter'
const setTimeoutPromise = promisify(setTimeout)

export interface ITaskRunner extends IEventEmitter { 
  run(opts: any): void; 
}

export class TaskRunner extends EventEmitter implements ITaskRunner {
  async run({whenToExecute, task = () => {}, context, callback}: any){
    if (task && typeof task !== 'function') {
      throw new Error('Task must be a function')
    }
    if (callback && typeof callback !== 'function') {
        throw new Error('Callback must be a function')
    }
    this.emit('begin');
    try {
      await setTimeoutPromise(whenToExecute || 0); 
      const data = await Promise.resolve().then(() => task.call(context));
      if (callback) callback(data)
      this.emit('end');
      this.emit('data', data);     
    } catch(err) {
      this.emit('error', err);
      if (callback) callback(err)
    }
  }
}  