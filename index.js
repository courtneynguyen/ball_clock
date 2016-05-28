var input = 27;
var masterQueue = [];
var FIXED_BALL_POSITION = 16;

var Ball = function(id){
  this.id = id;
};

Ball.prototype.setPosition = function (pos) {
  this.position = pos;
};

Ball.prototype.printBall = function () {
  console.log(`{ id: ${this.id}, position: ${this.position} }`);
};

var Queue = function (queueToFlowTo) {

  this.balls = [];
  this.size = this.balls.length;
  this.queueToFlowTo = queueToFlowTo;
};
Queue.prototype.readOrder = function () {
  this.balls.forEach((ball) => {
    ball.printBall();
  });
};
Queue.prototype.balls = [];
Queue.prototype.addBall = function (ball) {
  this.balls.push(ball);
  this.size = this.balls.length;
  if(this.balls.length === this.maxSize){
    this.flush();
  }
};
Queue.prototype.isFull = function () {
  return this.size === this.maxSize;
};
Queue.prototype.flush = function () {
  flushToQueue(this.queueToFlowTo, this.balls);
  this.balls = [];
  this.size = 0;
};

var BallClock = function(input){

  for(var x = 1; x < input+1; x++){
    var ball = new Ball(x);
    ball.setPosition(x);
    masterQueue.push(ball);
  }

  this.hourQueue = new HourQueue(13, masterQueue);
  this.fiveMinuteQueue = new FiveMinuteQueue(12, this.hourQueue);
  this.minuteQueue = new MinuteQueue(5, this.fiveMinuteQueue);

  var fixedBall = new Ball(0);
  fixedBall.setPosition(FIXED_BALL_POSITION);
  this.hourQueue.addBall(fixedBall);

  var queues = [this.minuteQueue, this.fiveMinuteQueue, this.hourQueue, masterQueue];

  this.getFirstQueueWithSpace = function(){
    for(var x = 0; x < queues.length; x++){
      if(queues[x].isFull() === false){
        return queues[x];
      }
      else {
        if(x === queues.length-1){
          return queues[x];
        }
        else {
          queues[x].flush();
          return queues[x];
        }
      }
    }
    return null;
  };

  this.saveInitialState = function(){
    var minuteBalls = this.minuteQueue.balls;
    var fiveMinuteBalls = this.fiveMinuteQueue.balls;
    var hourBalls = this.hourQueue.balls;
    var masterQueueBalls = masterQueue;
    var containerOfBalls = hourBalls.concat(masterQueueBalls);
    this.initialBallState = containerOfBalls.concat(minuteBalls);
    containerOfBalls = this.initialBallState;
    this.initialBallState = containerOfBalls.concat(fiveMinuteBalls);
  };

  for(var x = 1; x < input+1; x++){
    var queue = this.getFirstQueueWithSpace();
    if(x !== FIXED_BALL_POSITION){
      var ball = new Ball(x);
      ball.setPosition(x);
      queue.addBall(ball);
    }
  }

  this.saveInitialState();
};

BallClock.prototype.printCurrentTime = function(){
  console.log('(HOUR QUEUE)');
  this.hourQueue.readOrder();
  console.log('\n(FIVE MINUTE QUEUE)');
  this.fiveMinuteQueue.readOrder();
  console.log('\n(MINUTE QUEUE)');
  this.minuteQueue.readOrder();
  var minutes = this.fiveMinuteQueue.printTime() + this.minuteQueue.printTime();
  if (minutes.toString().length === 1){
    minutes = '0' + minutes;
  }
  console.log(this.hourQueue.printTime() +':' + (minutes));
};

BallClock.prototype.daysUntilInitialPosition = function(){

};

BallClock.prototype.daysPassed = function () {
  var days = this.hourQueue.time / 24;
  return days;
};

var MinuteQueue = function (config, queueToFlowTo) {
    Queue.call(this, queueToFlowTo);
  this.maxSize = config;
};

var FiveMinuteQueue = function(config, queueToFlowTo) {
    Queue.call(this, queueToFlowTo);
  this.maxSize = config;
};

var HourQueue = function (config, queueToFlowTo) {
  Queue.call(this, queueToFlowTo);
  this.maxSize = config;
  this.time = 1;
};

MinuteQueue.prototype = Object.create(Queue.prototype);
MinuteQueue.prototype.constructor = MinuteQueue;
MinuteQueue.prototype.printTime = function(){
  return this.balls.length;
};

FiveMinuteQueue.prototype = Object.create(Queue.prototype);
FiveMinuteQueue.prototype.constructor = FiveMinuteQueue;
FiveMinuteQueue.prototype.printTime = function(){
  return ((this.balls.length) * 5);
};

HourQueue.prototype = Object.create(Queue.prototype);
HourQueue.prototype.constructor = HourQueue;
HourQueue.prototype.printTime = function(){
  return this.balls.length;
};
HourQueue.prototype.flush = function () {
  var fixedBall = this.balls.shift();
  flushToQueue(masterQueue, this.balls);
  this.balls = [];
  this.addBall(fixedBall);
};

HourQueue.prototype.addBall = function (ball) {
  this.balls.push(ball);
  this.size = this.balls.length;
  this.time += 1;
};

var flushToQueue = function(nextQueue, queue){
  var tippingBall = queue.pop();
  var reverseOrder = queue.reverse();
  queue.forEach((ball) => {
    masterQueue.push(ball);
  });
  if(nextQueue instanceof Queue){
    nextQueue.addBall(tippingBall);
  }
  else {
    nextQueue.push(tippingBall);
  }
};

var testClock = new BallClock(input);
console.log(testClock.printCurrentTime());
