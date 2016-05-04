var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config.babel')
var path = require('path');

new WebpackDevServer(webpack(config), {
  publicPath:  'src/app',
  hot: true,
  inline: true,
  historyApiFallback: true
}).listen(3000, '0.0.0.0', function(err, result) {
  if (err) {
    console.log(err)
  }

  console.log('Listening at 0.0.0.0:3000')
})
