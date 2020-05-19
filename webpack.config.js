const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const Webpack = require("webpack");

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname,"./dist"),
        publicPath: "./dist/",
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js"
    },
    // 代码分割(webpack4.x以前使用CommonsChunkPlugin
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader"
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            // {
            //     test: /\.css$/,
            //     loader: "postcss-loader",
            //     options: {
            //         ident: "postcss",
            //         plugins: [
            //             require("autoprefixer")(),
            //             require("postcss-cssnext")(),
            //             require("postcss-sprites")({
                            
            //             })  // 合成雪碧图
            //         ]
            //     }
            // },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 1000,
                            publicPath: "",
                            outputPath: "dist/",
                            useRelativePath: true
                        }
                    },
                    {
                        loader: "img-loader",
                        options: {
                            pngquant: {
                                quality: 80
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new Webpack.optimize.CommonsChunkPlugin({
        //     name: "common",
        //     mixChunks: 2
        // })
        // new BundleAnalyzerPlugin()
    ],
    devServer: {
        port: 3001
    }
}