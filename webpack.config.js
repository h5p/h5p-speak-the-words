var path = require('path');

module.exports = {
  entry: {
    dist: './app/entries/dist.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'app'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'app'),
        loader: 'style!css?module'
      }
    ]
  }
};
