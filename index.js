var input = 45;
var masterQueue = [];
var masterQueueDisplacement = 27;
var FIXED_BALL_POSITION = 16;
var initialState = null;
var minutesInADay = 1440;

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

Ball.prototype.setTrack = function (track) {
  this.track = track;
};

Ball.prototype.printBall = function () {
  console.log(`{ id: ${this.id}, position: ${this.position}, track: ${this.track} }`);
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
  ball.setPosition((this.balls.length+1) + this.displacement);
  ball.setTrack(this.title);
  this.balls.push(ball);
  this.size = this.balls.length;
  if(this.balls.length === this.maxSize){
    this.flush();
  }
  if(this instanceof MinuteQueue){
    this.time += 1;
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
  shiftedBall.setPosition(this.displacement + (this.balls.length + 1));
  shiftedBall.setTrack(this.title);
  this.addBall(shiftedBall);
};

var BallClock = function(input){
  this.hourQueue = new HourQueue(13, masterQueue);
  this.fiveMinuteQueue = new FiveMinuteQueue(12, this.hourQueue);
  this.minuteQueue = new MinuteQueue(5, this.fiveMinuteQueue);

  this.getState = function(){
    var minuteBalls = this.minuteQueue.balls;
    var fiveMinuteBalls = this.fiveMinuteQueue.balls;
    var hourBalls = this.hourQueue.balls;
    var masterQueueBalls = masterQueue;
    rePositionQueue(masterQueueBalls, masterQueueDisplacement);
    var containerOfBalls = minuteBalls.concat(fiveMinuteBalls);
    var ballState = containerOfBalls.concat(hourBalls);
    containerOfBalls = ballState;
    ballState = containerOfBalls.concat(masterQueueBalls);
    return ballState.slice(0);
  };

  for(var x = 1; x < input+1; x++){
    var ball = new Ball(x);
    ball.setPosition(x + masterQueueDisplacement);
    ball.setTrack('MasterQueue');
    masterQueue.push(ball);
  }
  var fixedBall = new Ball(0);
  fixedBall.setPosition(FIXED_BALL_POSITION);
  fixedBall.setTrack(this.hourQueue.title);
  this.hourQueue.addBall(fixedBall);

  console.log('beginning setup:');
  var x = this.getState();
  console.log(x);

  var queues = [this.minuteQueue, this.fiveMinuteQueue, this.hourQueue];

  this.getFirstQueueWithSpace = function(){
    for(var x = 0; x < queues.length; x++){
      if(queues[x].isTipping() === true){
        queues[x].flush();
      }
      else if(queues[x].balls.length === (queues.maxSize-1)){
        return queues[x+1];
      }
      else {
        return queues[x];
      }
    }
    return null;
  };

  for(var x = 1; x < input+1; x++){
    var queue = this.getFirstQueueWithSpace();
    if(x !== FIXED_BALL_POSITION){
      queue.addBallFromMasterQueue();
    }
  }

  initialBallState = this.getState();
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
  console.log(this.initialBallState);
  // console.log(this.daysPassed() + ' days');
  this.minuteQueue.time = 0;
  this.daysUntilInitialPosition();
};

BallClock.prototype.daysUntilInitialPosition = function(){
  var statesAreEqual = false;
  while(statesAreEqual === false){

    var currentState = this.cycle();
    statesAreEqual = areStatesEqual(initialBallState, currentState);
  }
  console.log(input + ' balls cycle after ' + this.daysPassed() + ' days');
};

BallClock.prototype.daysPassed = function () {
  var days = Math.floor(this.minuteQueue.time / minutesInADay);
  return days;
};

BallClock.prototype.cycle = function () {
  this.minuteQueue.addBallFromMasterQueue();
  return this.getState();
};

var MinuteQueue = function (config, queueToFlowTo) {
  Queue.call(this, queueToFlowTo);
  this.maxSize = config;
  this.time = 0;
};

var FiveMinuteQueue = function(config, queueToFlowTo) {
  Queue.call(this, queueToFlowTo);
  this.maxSize = config;
};

var HourQueue = function (config, queueToFlowTo) {
  Queue.call(this, queueToFlowTo);
  this.maxSize = config;
};

MinuteQueue.prototype = Object.create(Queue.prototype);
MinuteQueue.prototype.constructor = MinuteQueue;
MinuteQueue.prototype.printTime = function(){
  return this.balls.length;
};
MinuteQueue.prototype.displacement = 0;
MinuteQueue.prototype.title = 'Minute Queue';
MinuteQueue.prototype.time = 0;

FiveMinuteQueue.prototype = Object.create(Queue.prototype);
FiveMinuteQueue.prototype.constructor = FiveMinuteQueue;
FiveMinuteQueue.prototype.printTime = function(){
  return ((this.balls.length) * 5);
};
FiveMinuteQueue.prototype.displacement = 4;
FiveMinuteQueue.prototype.title = 'Five-Minute Queue';

HourQueue.prototype = Object.create(Queue.prototype);
HourQueue.prototype.constructor = HourQueue;
HourQueue.prototype.printTime = function(){
  return this.balls.length;
};
HourQueue.prototype.displacement = 16;
HourQueue.prototype.flush = function () {
  var fixedBall = this.balls.shift();
  flushToQueue(masterQueue, this.balls);
  this.balls = [];
  this.addBall(fixedBall);
};
HourQueue.prototype.title = 'Hour Queue';

HourQueue.prototype.addBall = function (ball) {
  if(ball.position !== FIXED_BALL_POSITION){
    ball.setPosition((this.balls.length+1) + this.displacement);
  }
  this.balls.push(ball);
  this.size = this.balls.length;
  if(this.balls.length === this.maxSize){
    this.flush();
  }
};

var flushToQueue = function(nextQueue, queue){
  var tippingBall = queue.pop();
  var reverseOrder = queue.reverse();
  queue.forEach((ball) => {
    ball.setTrack('MasterQueue');
    ball.setPosition(masterQueueDisplacement + (masterQueue.length + 1));
    masterQueue.push(ball);
  });
  if(nextQueue instanceof Queue){
    tippingBall.setTrack(nextQueue.title);
    tippingBall.setPosition(nextQueue.displacement + (nextQueue.balls.length + 1));
    nextQueue.addBall(tippingBall);
  }
  else {
    tippingBall.setTrack('MasterQueue');
    tippingBall.setPosition(masterQueueDisplacement + (masterQueue.length + 1));
    nextQueue.push(tippingBall);
  }
};

var rePositionQueue = function(queue, displacement){
  queue.forEach((ball, index) => {
    ball.setPosition(displacement + index);
  });
}

var testClock = new BallClock(input);
console.log(testClock.printCurrentTime());
