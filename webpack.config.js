const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: [
    "./src/ui/index.tsx",
  ],
  resolve: {
    extensions: ["*", ".ts", ".tsx", ".js"],
  },

  module: {
    rules: [{
      test: /(src|test)\/.*\.tsx?$/,
      loader: "ts-loader",
      options: {
        configFile: "tsconfig-webpack.json",
      },
    }, {
      test: /\.(css|less)$/,
      use: [
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader",
        },
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      ],
    }],
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new HtmlWebpackPlugin({
      title: "Covid Cases",
    }),
  ],

  optimization: {
    minimize: false,
    splitChunks: {
      chunks: "all",
    },
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist/public"),
    publicPath: "/",
  },
};
