const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConfiguration = require('./webpack.config');


const mergeRules = (rules) => {
  return webpackConfiguration.module.rules.map(r => {
    let filtered = rules.filter(rule => r.test.toString() === rule.test.toString())
    if (filtered.length > 0) {
      return filtered[0]
    }
    return r
  })
}

const conf = merge(webpackConfiguration, {
  mode: 'production',

  /* Manage source maps generation process. Refer to https://webpack.js.org/configuration/devtool/#production */
  devtool: false,

  /* Optimization configuration */
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },

  /* Performance treshold configuration values */
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  /* Additional plugins configuration */
  plugins: []
});

conf.module.rules = mergeRules([{
  test: /\.css$/i,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        modules: {
          auto: true,
          localIdentName: "[hash:base64:7]"
        }
      }
    }, 
    "postcss-loader"
  ]
}])


module.exports = conf