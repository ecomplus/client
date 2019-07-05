'use strict'

const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    library: 'ecomUtils',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: 'ecom-utils.min.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'test'),
    compress: true,
    port: 9315,
    open: true
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
}
