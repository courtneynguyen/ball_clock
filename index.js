var input = 30;
var masterQueue = [];
var FIXED_BALL_POSITION = 17;

var areStatesEqual = function(initial, current){
  for(var x = 0; x < initial.length; x++){
    if(initial[x].position !== current[x].position){
      return false;
    }
  }
  return true;
};

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
Queue.prototype.isTipping = function () {
  return this.size === this.maxSize;
};
Queue.prototype.flush = function () {
  flushToQueue(this.queueToFlowTo, this.balls);
  this.balls = [];
  this.size = 0;
};

Queue.prototype.addBallFromMasterQueue = function () {
  var shiftedBall = masterQueue.shift();
  this.addBall(shiftedBall);
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

  var queues = [this.minuteQueue, this.fiveMinuteQueue, this.hourQueue];

  this.getFirstQueueWithSpace = function(){
    for(var x = 0; x < queues.length; x++){
      if(queues[x].isTipping() === false){
        return queues[x];
      }
      else {
        queues[x].flush();
        return queues[x];
      }
    }
    return null;
  };

  this.getState = function(){
    var minuteBalls = this.minuteQueue.balls;
    var fiveMinuteBalls = this.fiveMinuteQueue.balls;
    var hourBalls = this.hourQueue.balls;
    var masterQueueBalls = masterQueue;
    var containerOfBalls = hourBalls.concat(masterQueueBalls);
    var ballState = containerOfBalls.concat(minuteBalls);
    containerOfBalls = ballState;
    ballState = containerOfBalls.concat(fiveMinuteBalls);
    return ballState;
  };

  for(var x = 1; x < input+1; x++){
    var queue = this.getFirstQueueWithSpace();
    if(x !== FIXED_BALL_POSITION){
      queue.addBallFromMasterQueue();
    }
  }

  this.initialBallState = this.getState();
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
  // console.log(this.daysPassed() + ' days');
  this.hourQueue.time = 0;
  this.daysUntilInitialPosition();
};

BallClock.prototype.daysUntilInitialPosition = function(){
  var statesAreEqual = false;
  while(statesAreEqual === false){

    var currentState = this.cycle();
    statesAreEqual = areStatesEqual(this.initialBallState, currentState);
  }
  console.log(input + ' balls cycle after ' + this.daysPassed() + ' days');
};

BallClock.prototype.daysPassed = function () {
  var days = Math.floor(this.hourQueue.time / 24);
  return days;
};

BallClock.prototype.cycle = function () {
  this.minuteQueue.addBallFromMasterQueue();
  return this.getState();
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
  this.time = 0;
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
  if(this.balls.length === this.maxSize){
    this.flush();
  }
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
