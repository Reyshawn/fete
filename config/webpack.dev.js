const { merge } = require('webpack-merge');

const webpackConfiguration = require('./webpack.config');
const environment = require('./environment');

module.exports = merge(webpackConfiguration, {
  mode: 'development',

  /* Manage source maps generation process */
  devtool: 'eval-source-map',

  /* Development Server Configuration */
  devServer: {
    static: {
      directory: environment.paths.output,
      publicPath: '/',
      watch: true,
    },
    client: {
      overlay: true,
    },
    open: false,
    compress: false,
    hot: true,
    historyApiFallback: true,
    ...environment.server,
  },

  /* File watcher options */
  watchOptions: {
    aggregateTimeout: 300,
    poll: 300,
    ignored: /node_modules/,
  },

  /* Additional plugins configuration */
  plugins: [],
});