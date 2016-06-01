var Queue = require('./Queue');

var MasterQueue = function() {
  Queue.call(this);
};

MasterQueue.prototype = Object.create(Queue.prototype);
MasterQueue.prototype.constructor = MasterQueue;
MasterQueue.prototype.displacement = 27;
MasterQueue.prototype.title = 'Master Queue';

module.exports = MasterQueue;
