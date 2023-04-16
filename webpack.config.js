const path = require("path")
const webpack = require("webpack")

const postCSSPlugins = [require("postcss-import"), require("postcss-simple-vars"), require("postcss-nested"), require("autoprefixer"), require("postcss-mixins")]

module.exports = {
  entry: "./app/assets/scripts/App.js",
  output: {
    publicPath: "/",
    filename: "bundled.js",
    path: path.resolve(__dirname, "app")
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    watchFiles: ["./app/**/*.html"],
    static: "app",
    hot: true,
    port: 666,
    host: "0.0.0.0",
    historyApiFallback: { index: "index.html" }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env", { targets: { node: "12" } }]]
          }
        }
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: postCSSPlugins
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    fallback: { stream: require.resolve("stream-browserify"), crypto: require.resolve("crypto-browserify") }
  },
  experiments: {
    asyncWebAssembly: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"]
    })
  ]
}
