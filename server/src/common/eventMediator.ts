import { EventEmitter } from 'events';

export interface IEventMediator {
  eventNames(): (string|symbol)[];  
  publish(event: string, ...args: any[]): boolean;
  addListener(event: string, listener: Function): IEventMediator;
  removeListener(event: string, listener: Function): IEventMediator;  
  removeAllListeners(event?: string): IEventMediator;
}

export class EventMediator implements IEventMediator {
  private static classInstance: EventMediator;

  emitter: EventEmitter;

  static getInstance() {
    if (EventMediator.classInstance == null) {
      EventMediator.classInstance = new EventMediator();
    }
    return EventMediator.classInstance;
  }

	constructor() {
    this.emitter = new EventEmitter();
  }
  
  eventNames(){
    return this.emitter.eventNames();
  }
  
	
	publish(event: string, ...args:any[]) {
		return this.emitter.emit(event, ...args)
	}
	
	addListener(event:string, listener:any) {
    this.emitter.addListener(event, listener)
    return this;
  }
  	
	removeListener(event:string, listener:any) {
    this.emitter.removeListener(event, listener)
    return this;
  }
  
  removeAllListeners(event?: string) {
    if(event) {
      this.emitter.removeAllListeners(event);
    } else {
      this.emitter.removeAllListeners();
    }
    return this;
  }  
}