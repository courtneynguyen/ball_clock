import flushToQueue from './flushToQueue';

export default class Queue {
  constructor(queueToFlowTo, masterQueue) {
    this.balls = [];
    this.size = this.balls.length;
    this.queueToFlowTo = queueToFlowTo;
    this.masterQueue = masterQueue;
  }

  readOrder() {
    this.balls.forEach((ball) => {
      ball.printBall();
    });
  }

  addBall(ball) {
    ball.setPosition((this.balls.length+1) + this.displacement);
    ball.setTrack(this.title);
    this.balls.push(ball);
    this.size = this.balls.length;
    if(this.maxSize && this.balls.length === this.maxSize){
      this.flush();
    }
  }

  isTipping() {
    if(this.maxSize){
      return this.size === this.maxSize;
    }
    return false;
  }

  flush() {
    flushToQueue(this.queueToFlowTo, this.balls, this.masterQueue);
    this.balls = [];
    this.size = 0;
  }

  addBallFromMasterQueue() {
    var shiftedBall = this.masterQueue.balls.shift();
    shiftedBall.setPosition(this.displacement + (this.balls.length + 1));
    shiftedBall.setTrack(this.title);
    this.addBall(shiftedBall);
  }
}
