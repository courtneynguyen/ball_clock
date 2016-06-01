var Queue = require('./Queue');

var MinuteQueue = function (config, queueToFlowTo, master) {
  Queue.call(this, queueToFlowTo, master);
  this.maxSize = config;
  this.time = 0;
};

MinuteQueue.prototype = Object.create(Queue.prototype);
MinuteQueue.prototype.constructor = MinuteQueue;
MinuteQueue.prototype.printTime = function(){
  return this.balls.length;
};
MinuteQueue.prototype.displacement = 0;
MinuteQueue.prototype.title = 'Minute Queue';
MinuteQueue.prototype.time = 0;

module.exports = MinuteQueue;
