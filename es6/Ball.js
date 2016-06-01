export default class Ball {
  constructor(id){
    this.id = id;
  }

  setPosition(){
    this.position = pos;
  }

  setTrack(track){
    this.track = track;
  }

  printBall(){
    console.log(`{ id: ${this.id}, position: ${this.position}, track: ${this.track} }`);
  }
}
