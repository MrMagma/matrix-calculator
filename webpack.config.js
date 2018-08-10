const webpack = require("webpack");
const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        keep_infinity: true,
                        passes: 4
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({}),
            new webpack.BannerPlugin("Copyright 2018 Joshua Gammage\nLicensed under the Apache License, Version 2.0 (the \"License\");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\nhttp:\/\/www.apache.org\/licenses\/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an \"AS IS\" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.")
        ]
    },
    plugins: [
        new CleanPlugin(["dist"])
    ],
    devtool: "source-map",
    entry: {
        "dist/matrix-index.js": "./src/matrix-index.jsx"
    },
    output: {
        path: __dirname,
        filename: "[name]"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            },
            {
                test: /\.jsx$/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env", "react"]
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader"
            },
            {
                test: /\.css$/,
                loader: "css-loader",
                query: {
                    modules: true,
                    localIdentName: "[name]__[local]___[hash:base64:5]"
                }
            }
        ]
    },
    resolve: {
        alias: {
            "react": "preact-compat",
            "react-dom": "preact-compat"
        },
        modules: [
            path.resolve(__dirname, "js"),
            path.resolve(__dirname, "css"),
            path.resolve(__dirname, "img"),
            path.resolve(__dirname, "node_modules")
        ]
    }
}