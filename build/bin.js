#!/usr/bin/env node

'use strict'

process.env.NODE_ENV = 'production'

// Node.js modules
const path = require('path')

// build bundle with Webpack
const webpack = require('webpack')
const webpackConfig = require(path.join(process.cwd(), 'webpack.config'))

// additional Webpack plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
if (!webpackConfig.plugins) {
  webpackConfig.plugins = []
}
webpackConfig.plugins.push(
  new CleanWebpackPlugin(),
  // don't include dependencies to lib output
  new webpack.IgnorePlugin(/(@ecomplus\/utils|axios)/)
)

const fatalError = err => {
  if (err) {
    console.error(err)
  }
  // exit with failure
  process.exit(1)
}

webpack(webpackConfig, (err, stats) => {
  // console.log(stats)
  if (err) {
    fatalError(err)
  }

  // check and handle webpack errors and warnings
  const info = stats.toJson()
  if (stats.hasErrors()) {
    let err = info.errors
    fatalError(err)
  }
  if (stats.hasWarnings()) {
    console.warn(info.warnings)
  }
})
