import Queue from './Queue';

export default class MinuteQueue extends Queue {
  constructor(config, queueToFlowTo, master) {
    Queue.call(this, queueToFlowTo, master);
    this.maxSize = config;
    this.time = 0;
    this._displacement = 0;
    this.title = 'Minute Queue';
  }

  get displacement(){
    return this._displacement;
  }

  set displacement(displacement){
    if(displacement){
      this._displacement = displacement;
    }
  }

  get time(){
    return this._time;
  }

  set time(time){
    if(time){
      this._time = time;
    }
  }

  printTime() {
    return this.balls.length;
  }
}
