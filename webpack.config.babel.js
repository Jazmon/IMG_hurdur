var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, 'src/app'),
  devtool: debug ? 'inline-sourcemap' : null,
  entry: ['babel-polyfill', './scripts/index.jsx'],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']/*,
          plugins: ['transform-class-properties']*/
        }
      },
      {
        test: /\.scss$/,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: debug,
            modules: true,
            localIdentName: debug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            minimize: !debug
          })}`/*,
          'postcss-loader?parsers=postcss-scss'*/
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          name: debug ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
          limit: 10000
        }
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
        query: {
          name: debug ? '[path][name].[ext]?[hash]' : '[hash].[ext]'
        }
      }
    ]
  },
  output: {
    path: __dirname + '/src/app/',
    filename: 'bundle.min.js'
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false})
  ]
}
