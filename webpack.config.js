const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const Webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname,"./dist"),
        publicPath: "./dist/",
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js"
    },
    // 代码分割(webpack4.x以前使用CommonsChunkPlugin
    optimization: {
        usedExports: true,  // treesharking
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
            {
                test: /\.css$/,
                loader: "postcss-loader",
                options: {
                    ident: "postcss",
                    plugins: [
                        require("autoprefixer")(),
                        require("postcss-cssnext")(),
                        require("postcss-sprites")({
                            
                        })  // 合成雪碧图
                    ]
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: "url-loader",  // base64 打包
                        options: {
                            limit: 2048,
                            publicPath: "",
                            outputPath: "dist/", // 输出目录
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
            },
            {
                test: /\.(svg|eft))$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        name: "[name]_[hash].[ext]",
                        outputPath: "images/"   // 打包至某一个文件夹
                    }
                }
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