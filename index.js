var input = 28;

var Ball = function(id){
  this.id = id;
};

Ball.prototype.setPosition = function (pos) {
  this.position = pos;
};

Ball.prototype.printBall = function () {
  console.log(`{ id: ${this.id}, position: ${this.position} }`);
};

var Queue = function (config) {

  this.balls = [];
  this.size = this.balls.length;
  if(config && config.maxSize){
    this.maxSize = config.maxSize;
  }
};
Queue.prototype.readOrder = function () {
  console.log('(');
  this.balls.map((ball) => {
    ball.printBall();
  });
  console.log(')\n');
};
Queue.prototype.balls = [];
Queue.prototype.addBall = function (ball) {
  this.balls.push(ball);
  this.size += 1;
};
Queue.prototype.isFull = function () {
  if(this.maxSize){
    return this.size === this.maxSize-1;
  }
  else {
    return false;
  }
};

Queue.prototype.printTime = function () {
  console.log('no op');
};

var BallClock = function(input){
  this.minuteQueue = new MinuteQueue(5);
  this.fiveMinuteQueue = new FiveMinuteQueue(12);
  this.hourQueue = new HourQueue(13);
  this.masterQueue = new Queue();
  var queues = [this.minuteQueue, this.fiveMinuteQueue, this.hourQueue, this.masterQueue];
  this.getFirstQueueWithSpace = function(){
    for(var x = 0; x < queues.length; x++){
      if(queues[x].isFull() === false){
        return queues[x];
      }
    }
    return null;
  }


  for(var x = 1; x < input; x++){
    var queue = this.getFirstQueueWithSpace();
    if(x !== 17){
      var ball = new Ball(x);
      ball.setPosition(x);
      queue.addBall(ball);
    }
  }
};

BallClock.prototype.printCurrentTime = function(){
  this.hourQueue.readOrder();
  this.fiveMinuteQueue.readOrder();
  this.minuteQueue.readOrder();
  console.log(this.hourQueue.printTime() +':' + (this.fiveMinuteQueue.printTime() + this.minuteQueue.printTime()));
  // this.queues.forEach((queue) => {
  //   queue.readOrder();
  // });
};

BallClock.prototype.daysUntilInitialPosition = function(){

};

var MinuteQueue = function (config) {
    Queue.call(this);
  this.maxSize = config;
};

var FiveMinuteQueue = function(config) {
    Queue.call(this);
  this.maxSize = config;
};

var HourQueue = function (config) {
  Queue.call(this);
  this.maxSize = config;
  var fixedBall = new Ball(0);
  fixedBall.setPosition(17);
  this.addBall(fixedBall);
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

var testClock = new BallClock(input);
console.log(testClock.printCurrentTime());
