const path = require("path"); 
const HtmlWebpackPlugin = require("html-webpack-plugin"); 
const DotenvWebpackPlugin = require("dotenv-webpack");
 
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
    }), 
    new DotenvWebpackPlugin()
  ], 
 
  devServer: { 
    static: "./dist", 
    port: 3001, 
    open: true, 
  }, 
};