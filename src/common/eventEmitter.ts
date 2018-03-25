export interface IEventEmitter {
  addListener(event: string, listener: Function): IEventEmitter;
  on(event: string, listener: Function): IEventEmitter;
  once(event: string, listener: Function): IEventEmitter;
  removeListener(event: string, listener: Function): IEventEmitter;
  removeAllListeners(event?: string): IEventEmitter;
  setMaxListeners(n: number): void;
  listeners(event: string): Function[];
  emit(event: string, ...args: any[]): boolean;
}