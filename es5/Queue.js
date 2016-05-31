var flushToQueue = require('./flushToQueue');

var Queue = function (queueToFlowTo, masterQueue) {
  this.balls = [];
  this.size = this.balls.length;
  this.queueToFlowTo = queueToFlowTo;
  this.masterQueue = masterQueue;
};

Queue.prototype.readOrder = function () {
  this.balls.forEach((ball) => {
    ball.printBall();
  });
};
Queue.prototype.balls = [];
Queue.prototype.addBall = function (ball) {
  ball.setPosition((this.balls.length+1) + this.displacement);
  ball.setTrack(this.title);
  this.balls.push(ball);
  this.size = this.balls.length;
  if(this.maxSize && this.balls.length === this.maxSize){
    this.flush();
  }
};
Queue.prototype.isTipping = function () {
  if(this.maxSize){
    return this.size === this.maxSize;
  }
  return false;
};
Queue.prototype.flush = function () {
  flushToQueue(this.queueToFlowTo, this.balls, this.masterQueue);
  this.balls = [];
  this.size = 0;
};
Queue.prototype.addBallFromMasterQueue = function () {
  var shiftedBall = this.masterQueue.balls.shift();
  shiftedBall.setPosition(this.displacement + (this.balls.length + 1));
  shiftedBall.setTrack(this.title);
  this.addBall(shiftedBall);
};

module.exports = Queue;
