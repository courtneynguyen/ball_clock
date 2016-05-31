var path = require('path');
module.exports = {
  entry: {
    "./dist/index": "./es5/main"
  },
  output: {
    filename: '[name].js',
    library: 'BallClock',
    targetLibrary: 'this'
  }
};
