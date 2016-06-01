var flushToQueue = function(nextQueue, queue, masterQueue){
  var tippingBall = queue.pop();
  var reverseOrder = queue.reverse();
  queue.forEach((ball) => {
    ball.setTrack('MasterQueue');
    ball.setPosition(masterQueue.displacement + (masterQueue.balls.length + 1));
    masterQueue.addBall(ball);
  });
  tippingBall.setTrack(nextQueue.title);
  tippingBall.setPosition(nextQueue.displacement + (nextQueue.balls.length + 1));
  nextQueue.addBall(tippingBall);
};

module.exports = flushToQueue;
