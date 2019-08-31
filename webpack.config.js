const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.ts"
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 8001
  }
};
