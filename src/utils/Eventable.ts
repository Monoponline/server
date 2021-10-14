import EventEmitter from 'events';

export default class Eventable {
  private eventEmitter = new EventEmitter();

  public on(event: string, callback: (...args: any[]) => void) {
    this.eventEmitter.on(event, callback);
  }

  public once(event: string, callback: (...args: any[]) => void) {
    this.eventEmitter.once(event, callback);
  }

  public emit(event: string, ...args: any[]) {
    this.eventEmitter.emit(event, ...args);
  }
}
