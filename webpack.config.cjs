const path = require("path");

module.exports = {
  entry: "./frontend/src/index.js",
  output: {
    path: path.resolve(__dirname, "frontend/public"),
    filename: "bundle.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,                 
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: true,
            configFile: path.resolve(__dirname, ".babelrc")
          }
        }
      }
    ]
  },
  resolve: { extensions: [".js", ".jsx"] }
};
