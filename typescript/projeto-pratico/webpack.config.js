const path = require("path"); 
const HtmlWebpackPlugin = require("html-webpack-plugin"); 
const DotenvWebpackPlugin = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
 
module.exports = { 
  entry: "./src/index.ts", 
  module: { 
    rules: [ 
      { 
        test: /\.ts$/, 
        use: "ts-loader", 
        exclude: /node_modules/, 
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ], 
  }, 
  resolve: { 
    extensions: [".ts", ".js"], 
  }, 
  output: { 
    filename: "bundle.js", 
    path: path.resolve(__dirname, "dist"), 
    clean: true, 
  }, 
  plugins: [ 
    new HtmlWebpackPlugin({ 
      template: "./index.html", 
      favicon: "./public/favicon.png",
    }), 
    new DotenvWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "public" }],
    })
  ], 
 
  devServer: { 
    static: [
      { directory: path.join(__dirname, "dist") },
      { directory: path.join(__dirname, "public") }
    ],
    port: 3001, 
    open: true, 
  }, 
};