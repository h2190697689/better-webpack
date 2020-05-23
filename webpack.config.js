/**
 * @author hejiamin
 * @description 可结合README.md
 * @date 2020/5/22
 */
const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");  // 打包分析工具
const  MiniCssExtractPlugin = require("mini-css-extract-plugin");   // css代码分割(不进行热更新，所以最好在线上环境使用)
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");  //css代码压缩
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");   //往打包生成的index.html中添加内容
const Webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname,"./dist"),
        publicPath: "./dist/",
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js" // 代码分割时，依赖库打包名称
    },
    // 代码分割(webpack4.x以前使用CommonsChunkPlugin
    optimization: {
        usedExports: true,  // treesharking
        splitChunks: {
            chunks: 'all'
        },
        minimizer:[
            new UglifyjsWebpackPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCssAssetsWebpackPlugin()
        ]
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
                    loader: "file-loader",
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
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[name].chunk.css"
        }),
        // new Webpack.optimize.CommonsChunkPlugin({
        //     name: "common",
        //     mixChunks: 2
        // })
        new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, "./dll/lodash.dll.js")
        }),
        new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, "./dll/react.dll.js")
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, "./dll/lodash.manifest.json")
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, "./dll/react.manifest.json")
        })
        // new BundleAnalyzerPlugin()
    ],
    devServer: {
        port: 3001
    }
}