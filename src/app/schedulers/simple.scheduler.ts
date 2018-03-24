import { EventEmitter } from 'events';
import * as promisify from 'util-promisify';

const setTimeoutPromise = promisify(setTimeout)

export class SimpleScheduler extends EventEmitter  {
  async start({whenToExecute, task = () => {}, context, callback}: any){
    if (task && typeof task !== 'function') {
      throw new Error('Task must be a function')
    }
    if (callback && typeof callback !== 'function') {
        throw new Error('Callback must be a function')
    }
    this.emit('begin');
    try {
      await setTimeoutPromise(whenToExecute || 0); 
      console.time('execute');               
      const data = await Promise.resolve().then(() => task.call(context));
      if (callback) callback(data)
      console.timeEnd('execute');
      this.emit('end');
      this.emit('data', data);     
    } catch(err) {
      this.emit('error', err);
      if (callback) callback(err)
    }
  }
}  