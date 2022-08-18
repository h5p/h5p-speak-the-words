var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var nodeEnv = process.env.NODE_ENV || 'development';
var isDev = (nodeEnv !== 'production');

var config = {
  entry: {
    dist: './app/entries/dist.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'h5p-speak-the-words.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'app'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'app'),
        use: [
          {
            loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ]
  }
};

if (isDev) {
  config.devtool = 'inline-source-map';
}
else {
  config.plugins = [new MiniCssExtractPlugin({
    filename: 'h5p-speak-the-words.css'
  })];
}

module.exports = config;
