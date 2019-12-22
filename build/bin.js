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

// web target builds
;[
  '.bundle',
  '.polyfill',
  ''
].forEach(outputType => {
  const config = {
    ...webpackConfig,
    output: {
      ...webpackOutput,
      // custom filename by output type
      filename: webpackOutput.filename.replace('.js', `${outputType}.min.js`)
    }
  }

  // edit Webpack config by output type
  if (outputType !== '.bundle') {
    // lib and polyfills without external dependencies
    config.externals = [{
      '@ecomplus/utils': {
        commonjs: '@ecomplus/utils',
        commonjs2: '@ecomplus/utils',
        root: 'ecomUtils'
      },
      axios: 'axios'
    }]
    if (outputType === '') {
      // standalone lib output
      // also ignore polyfills
      config.externals.push(/^core-js/i)
    }
  }
  webpackConfigList.push(config)
})

// add Node.js output
webpackConfigList.push({
  ...webpackConfig,
  target: 'node',
  optimization: {
    minimize: false
  },
  output: {
    ...webpackOutput,
    filename: webpackOutput.filename.replace('.js', '.node.js')
  },
  externals: /^(@ecomplus\/utils|axios)/i
})

webpack(webpackConfigList, (err, stats) => {
  // console.log(stats)
  if (err) {
    fatalError(err)
  }

  // check and handle webpack errors and warnings
  const info = stats.toJson()
  if (stats.hasErrors()) {
    const err = info.errors
    fatalError(err)
  }
  if (stats.hasWarnings()) {
    console.warn(info.warnings)
  }
})
