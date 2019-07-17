#!/usr/bin/env node

'use strict'

process.env.NODE_ENV = 'production'

// Node.js modules
const path = require('path')

// build bundle with Webpack
const webpack = require('webpack')
const webpackConfig = require(path.join(process.cwd(), 'webpack.config'))
// handle Webpack output object and plugins
const webpackOutput = { ...webpackConfig.output }

const fatalError = err => {
  if (err) {
    console.error(err)
  }
  // exit with failure
  process.exit(1)
}

// setup config for multiple outputs
const webpackConfigList = []

;[
  '.bundle',
  '.polyfill',
  ''
].forEach(outputType => {
  let config = {
    ...webpackConfig,
    output: {
      ...webpackOutput,
      // custom filename by output type
      filename: webpackOutput.filename.replace('.js', `${outputType}.min.js`)
    }
  }

  // edit Webpack config by output type
  switch (outputType) {
    case '.bundle':
      // dependencies and polyfills
      break
    case '.polyfill':
      // lib and polyfills
      config.externals = /^(@ecomplus\/utils|axios)/i
      break
    default:
      // standalone lib output
      config.externals = /^(@babel\/runtime|@ecomplus\/utils|axios|core-js)/i
  }
  webpackConfigList.push(config)
})

webpack(webpackConfigList, (err, stats) => {
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
