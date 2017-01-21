/* eslint-disable import/no-extraneous-dependencies */
// const webpack = require('webpack')
const config = require('config')

const host = config.get('wallaby.host')
const basePath = config.get('wallaby.base_path')
const configPath = config.get('wallaby.endpoints.config')
const configUrl = `${host}${basePath}${configPath}`

module.exports = {
  entry: './src/client.js',
  output: {
    path: './dist/scripts',
    filename: 'client.js'
  },
  target: 'web',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'async-to-bluebird'],
          plugins: ['transform-runtime'],
          babelrc: false
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /client\.js$/,
        loader: 'string-replace',
        exclude: /node_modules/,
        query: {
          search: 'API_CONFIG_URL',
          replace: configUrl
        }
      }
    ]
  },
  plugins: [
    // TODO
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    // new webpack.optimize.DedupePlugin()
  ]
}
