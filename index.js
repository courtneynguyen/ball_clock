var BallClock = require('./es5/BallClock');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('resume', () => {
  askBallQuestion();
});

rl.on('close', () => {
  console.log('Have a nice day!');
});

var askBallQuestion = function(){
  rl.question('\n-------------------------\nBallClock Problem\n-------------------------\nEnter in a number between 27-127:\n', (answer) => {
    if(answer === '0'){
      console.log('\nEnd of Input');
      rl.pause();
      rl.close();
    }
    else {
      rl.pause();
      var answer;
      try{
        answer = parseInt(answer, 10);
        console.log('you have inputted ', answer);
        if(answer >= 27 && answer <= 127){
          var start = new Date();
          console.log('Beginning timer now ', start);
          var testClock = new BallClock(answer);
          // testClock.printCurrentTime();
          testClock.daysUntilInitialPosition();
          var end = new Date().getTime();
          var time = end - start;
          console.log('Execution time: ' + time + "ms");
          rl.resume();
        }
        else{
          throw new Error('Incorrect Input. Exiting...');
        }
      }
      catch(e){
        console.log('Invalid input ', e);
        rl.pause();
        rl.close();
      }
    }
  });
};

askBallQuestion();
