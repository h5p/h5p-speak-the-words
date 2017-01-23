var path = require('path');

module.exports = {
  entry: {
    dev: './dev/entries/dev-spanish-hello.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'app'),
          path.resolve(__dirname, 'dev')
        ],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'app'),
          path.resolve(__dirname, 'dev')
        ],
        loader: 'style!css'
      },
      {
        test: /\.woff(2)?/,
        include: path.resolve(__dirname, 'dev'),
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)/,
        include: path.resolve(__dirname, 'dev'),
        loader: "file"
      },
      {
        test: /\.png$/,
        include: path.resolve(__dirname, 'dev'),
        loader: "file?name=[name].[ext]"
      },
      {
        test: /\.json$/,
        include: path.resolve(__dirname),
        exclude: [
          path.resolve(__dirname, 'dev'),
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'app')
        ],
        loader: "json"
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    port: 8050,
    contentBase: './dev'
  }
};
