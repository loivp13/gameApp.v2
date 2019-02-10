const path = require("path");
const webpack = require("webpack");
module.exports = {
  entry: {
    index: [
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
      "../bin/www"
    ]
  },
  mode: "development",
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/"
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        test: path.resolve(__dirname, "../bin/www"),
        use: "shebang-loader"
      }
    ]
  }
};
