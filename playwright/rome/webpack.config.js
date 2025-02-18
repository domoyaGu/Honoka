const path = require("path")
const nodeExternals = require("webpack-node-externals")
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  target: "node",
  node: {
    __dirname: true
  },
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, "dist")
  },
  plugins: [new NodePolyfillPlugin()],
  externals: [nodeExternals({
    allowlist: ['fs'] // 显式包含fs模块
  })],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    alias: {}
  }
}