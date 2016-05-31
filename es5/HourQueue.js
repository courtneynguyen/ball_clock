var Queue = require('./Queue');
var flushToQueue = require('./flushToQueue');

var HourQueue = function (config, queueToFlowTo, fixedBallPosition) {
  Queue.call(this, queueToFlowTo, queueToFlowTo);
  this.maxSize = config;
  this.FIXED_BALL_POSITION = fixedBallPosition;
};

HourQueue.prototype = Object.create(Queue.prototype);
HourQueue.prototype.constructor = HourQueue;
HourQueue.prototype.printTime = function(){
  return this.balls.length;
};
HourQueue.prototype.displacement = 16;
HourQueue.prototype.flush = function () {
  var fixedBall = this.balls.shift();
  flushToQueue(this.queueToFlowTo, this.balls, this.masterQueue);
  this.balls = [];
  this.addBall(fixedBall);
};
HourQueue.prototype.title = 'Hour Queue';

HourQueue.prototype.addBall = function (ball) {
  if(ball.position !== this.FIXED_BALL_POSITION){
    ball.setPosition((this.balls.length+1) + this.displacement);
  }
  this.balls.push(ball);
  this.size = this.balls.length;
  if(this.balls.length === this.maxSize){
    this.flush();
  }
};

module.exports = HourQueue;
