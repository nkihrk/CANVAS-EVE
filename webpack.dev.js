const merge = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './build',
    index: 'index.html',
    hot: true
  },
  plugins: [webpack.HotModuleReplacementPlugin()]
});
