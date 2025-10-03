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
        test: /\.jsx?$/,                 // parse .js and .jsx
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // Force babel-loader to read your .babelrc in THIS folder
            babelrc: true,
            configFile: path.resolve(__dirname, ".babelrc")
          }
        }
      }
    ]
  },
  resolve: { extensions: [".js", ".jsx"] }
};
