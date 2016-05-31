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

module.exports = Ball;
