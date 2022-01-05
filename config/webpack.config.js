/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

const environment = require('./environment');


module.exports = {
  entry: {
    app: path.resolve(environment.paths.source, 'index.tsx'),
  },
  output: {
    filename: 'js/[name].js',
    path: environment.paths.output,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ],
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          },
        },
        generator: {
          filename: 'images/design/[name].[hash:6][ext]',
        },
      },
      // {
      //   test: /\.(eot|ttf|woff|woff2)$/,
      //   type: 'asset',
      //   parser: {
      //     dataUrlCondition: {
      //       maxSize: environment.limits.images,
      //     },
      //   },
      //   generator: {
      //     filename: 'images/design/[name].[hash:6][ext]',
      //   },
      // },
    ],
  },

  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    // new ImageMinimizerPlugin({
    //   test: /\.(jpe?g|png|gif|svg)$/i,
    //   minimizerOptions: {
    //     // Lossless optimization with custom option
    //     // Feel free to experiment with options for better result for you
    //     plugins: [
    //       ['gifsicle', {
    //         interlaced: true
    //       }],
    //       ['jpegtran', {
    //         progressive: true
    //       }],
    //       ['optipng', {
    //         optimizationLevel: 5
    //       }],
    //       [
    //         'svgo',
    //         {
    //           plugins: [{
    //             name: 'removeViewBox',
    //             active: false,
    //           }, ],
    //         },
    //       ],
    //     ],
    //   },
    // }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
    }),

    new HTMLWebpackPlugin({
      template: path.resolve('public/index.html')
    })
    // new CopyWebpackPlugin({
    //   patterns: [{
    //     from: path.resolve(environment.paths.source, 'images', 'content'),
    //     to: path.resolve(environment.paths.output, 'images', 'content'),
    //     toType: 'dir',
    //     globOptions: {
    //       ignore: ['*.DS_Store', 'Thumbs.db'],
    //     },
    //   }, ],
    // }),
  ], // .concat(htmlPluginEntries),
  target: 'web',
};