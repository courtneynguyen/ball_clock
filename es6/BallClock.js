var Ball = require('./Ball');
var MasterQueue = require('./MasterQueue');
var HourQueue = require('./HourQueue');
var FiveMinuteQueue = require('./FiveMinuteQueue');
var MinuteQueue = require('./MinuteQueue');

var BallClock = function(input){

  if(!input){
    input = 30;
  }

  this.input = input;
  this.masterQueue = new MasterQueue();
  this.FIXED_BALL_POSITION = 16;
  this.MINUTES_IN_A_DAY = 1440;

  this.hourQueue = new HourQueue(13, this.masterQueue, this.FIXED_BALL_POSITION);
  this.fiveMinuteQueue = new FiveMinuteQueue(12, this.hourQueue, this.masterQueue);
  this.minuteQueue = new MinuteQueue(5, this.fiveMinuteQueue, this.masterQueue);
  this.initialState = null;

  this.rePositionQueue = function(queue, displacement){
    queue.forEach((ball, index) => {
      ball.setPosition(displacement + index);
    });
  };

  this.getState = function(){
    var minuteBalls = this.minuteQueue.balls;
    var fiveMinuteBalls = this.fiveMinuteQueue.balls;
    var hourBalls = this.hourQueue.balls;
    var masterQueueBalls = this.masterQueue.balls;
    this.rePositionQueue(masterQueueBalls, this.masterQueue.displacement);
    var containerOfBalls = minuteBalls.concat(fiveMinuteBalls);
    var ballState = containerOfBalls.concat(hourBalls);
    containerOfBalls = ballState;
    ballState = containerOfBalls.concat(masterQueueBalls);
    return ballState.slice(0);
  };

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

  this.areStatesEqual = function(initial, current){
    for(var x = 0; x < initial.length; x++){
      if(initial[x].position !== current[x].position){
        return false;
      }
    }
    return true;
  };

  for(var x = 1; x < this.input+1; x++){
    var ball = new Ball(x);
    ball.setPosition(x + this.masterQueue.displacement);
    ball.setTrack('MasterQueue');
    this.masterQueue.addBall(ball);
  }
  var fixedBall = new Ball(0);
  fixedBall.setPosition(this.FIXED_BALL_POSITION);
  fixedBall.setTrack(this.hourQueue.title);
  this.hourQueue.addBall(fixedBall);

  var queues = [this.minuteQueue, this.fiveMinuteQueue, this.hourQueue];

  for(var x = 1; x < this.input+1; x++){
    var queue = this.getFirstQueueWithSpace();
    if(x !== this.FIXED_BALL_POSITION){
      queue.addBallFromMasterQueue();
    }
  }

  this.initialBallState = this.getState();
};

BallClock.prototype.readStack = function(){
  console.log('(HOUR QUEUE)');
  this.hourQueue.readOrder();
  console.log('\n(FIVE MINUTE QUEUE)');
  this.fiveMinuteQueue.readOrder();
  console.log('\n(MINUTE QUEUE)');
  this.minuteQueue.readOrder();
};

BallClock.prototype.printCurrentTime = function(){
  var minutes = this.fiveMinuteQueue.printTime() + this.minuteQueue.printTime();
  if (minutes.toString().length === 1){
    minutes = '0' + minutes;
  }
  console.log(this.hourQueue.printTime() + ':' + minutes);
};

BallClock.prototype.daysUntilInitialPosition = function(){
  var statesAreEqual = false;
  while(statesAreEqual === false){
    var currentState = this.cycle();
    statesAreEqual = this.areStatesEqual(this.initialBallState, currentState);
  }
  console.log(this.input + ' balls cycle after ' + this.daysPassed() + ' days');
};

BallClock.prototype.daysPassed = function () {
  var days = Math.floor(this.minuteQueue.time / this.MINUTES_IN_A_DAY);
  return days;
};

BallClock.prototype.cycle = function () {
  this.minuteQueue.addBallFromMasterQueue();
  this.minuteQueue.time += 1;
  return this.getState();
};

module.exports = BallClock;
