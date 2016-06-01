var Queue = require('./Queue');

var FiveMinuteQueue = function(config, queueToFlowTo, master) {
  Queue.call(this, queueToFlowTo, master);
  this.maxSize = config;
};

FiveMinuteQueue.prototype = Object.create(Queue.prototype);
FiveMinuteQueue.prototype.constructor = FiveMinuteQueue;
FiveMinuteQueue.prototype.printTime = function(){
  return ((this.balls.length) * 5);
};
FiveMinuteQueue.prototype.displacement = 4;
FiveMinuteQueue.prototype.title = 'Five-Minute Queue';

module.exports = FiveMinuteQueue;
