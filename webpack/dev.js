// const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./common');

module.exports = webpackMerge.merge(common, {
  mode: 'development',
  output: {
    filename: 'admin.js',
    path: '/Users/ranhe/circle/web/dev/controller',
    // filename: '[name].js',
    // path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
});
