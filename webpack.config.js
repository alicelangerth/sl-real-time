path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: './app/index.js',
  output: {
    path: path.join(__dirname, 'client/public'),
    filename: 'app.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },    
      { 
        test: /\.scss$/,
        loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
      }
        
    ],
  },
};