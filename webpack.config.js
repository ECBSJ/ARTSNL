const path = require("path")
const Dotenv = require("dotenv-webpack")
const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const currentTask = process.env.npm_lifecycle_event

const postCSSPlugins = [require("postcss-import"), require("postcss-simple-vars"), require("postcss-nested"), require("autoprefixer"), require("postcss-mixins")]

let cssConfig = {
  test: /\.css$/i,
  use: [
    {
      loader: "css-loader",
      options: {
        url: false,
      },
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: postCSSPlugins,
        },
      },
    },
  ],
}

let config = {
  entry: "./app/assets/scripts/App.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env", { targets: { node: "12" } }]],
          },
        },
      },
      cssConfig,
    ],
  },
  resolve: {
    fallback: { stream: require.resolve("stream-browserify"), crypto: require.resolve("crypto-browserify") },
  },
  experiments: {
    asyncWebAssembly: true,
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new Dotenv(),
    new HtmlWebpackPlugin({ filename: "index.html", template: "./app/index.html" }),
  ],
}

if (currentTask == "dev") {
  cssConfig.use.unshift("style-loader")
  config.output = {
    publicPath: "/",
    filename: "bundled.js",
    path: path.resolve(__dirname, "app"),
  }
  config.devServer = {
    watchFiles: ["./app/**/*.html"],
    static: "app",
    hot: true,
    port: 666,
    host: "0.0.0.0",
    historyApiFallback: { index: "index.html" },
  }
  config.mode = "development"
  config.devtool = "source-map"
}

if (currentTask == "build") {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader)
  config.output = {
    publicPath: "/",
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
  }
  config.mode = "production"
  config.devtool = "source-map"
  config.optimization = {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()],
  }
  config.plugins.push(new CleanWebpackPlugin(), new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }))
}

module.exports = config
