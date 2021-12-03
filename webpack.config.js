const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  module: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
};
