# webpack

## 代码分割

### 实现方式
1. 入口文件： 配置webpack多入口
2. 重复代码： splitchunks插件
3. 动态引入： import() 或者 require.ensure()

#### 入口配置
1. 
```
entry: {
    app: "./app.js",
    name: "./name.js"
}
```

#### SplitChunksPlugin
1. webpack4.x以后，CommonsChunkPlugin被取代
- 共享代码块或者node_modules 文件夹中代码块
- 分割体积大于30KB的代码块
- 按需加载代码块时的并行请求数量不超过5个
- 加载初始页面时的并行请求数量不超过3个
2. 配置
```
optimization: {
    splitChunks: {
        chunks: "all",  // 代码块  'all'(所有代码块)   'async'(按需加载代码块)  'initial'(初始化代码块)
        minSize: 3000,  // 模块的最小体积
        minChunks: 1, // 模块的最小被引用次数
        maxAsyncRequests: 5, // 按需加载的最大并行请求数
        maxInitialRequests: 3, // 一个入口最大并行请求数
        automaticNameDelimiter: '~', // 文件名的连接符
        name: true,
        cacheGroups: { // 缓存组
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
            }
        }
    }
}
```

#### 动态引入
1. require.ensure
2. import()     (babel-plugin-syntax-dynamic-import)
```
import(
    /* webpackChunkName: 'mychunkname' */   // chunk名称
    /* webpackMode: lazy */      // 懒加载
    /* webpackPrefetch: true */   // 预加载

    modulename
)
```

### 依赖分析
1. webpack-bundle-analyzer
```
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
plugins: [
    new BundleAnalyzerPlugin()
]
```

## tree-shaking 
> Tree Shaking 只支持 ES6 Module(静态引入)
1. 配置(mode: development)
```
webpack.config.js(mode: production下可不配置):
optimization: {
    usedExports: true
}

package.json:  (任何模式都需要配置)
"sideEffects": false / ["@babel/polly-fill","*.css"]
```

## 浏览器缓存
1. 文件更改，浏览器访问新的js内容
```
output: {
    path: path.resolve(__dirname,"./dist"),
    filename: "[name].[contenthash].js",
    chunkname: "[name].[contenthash].chunk.js"
}

* 老版本额外配置项
optimization: {
    runtimeChunk: {
        name："runtime"
    }
}
```

## shimming垫片
1. 全局可引用的变量
```
new webpack.ProvidePlugin({
    $: "jquery",
    _: "lodash",
    _join: ["lodash","join"]
})
```
2. 改变模块this指向
```
{
    test: /\.js$/,
    use: [
        "babel-loader",
        "imports-loader?this=>window"
    ]
}
```


## 环境变量
1. 通过环境变量确定webpack配置
```
    package.json文件中：
    "build": "webpack --env.production --config ./build/weback.product.js"

    webpack.js文件中：
    module.exports = (env)=>{
        if(env && env.production){
            return merge(commonConfig, prodConfig);
        } else{
            return merge(commonConfig, devConfig);
        }
    }
```


## library打包
1. package.json
```
    "name: "myName",
    "main": "./dist/library.js",
    "license": "MIT"  // 完全开源形式
```
2. webpack.config.js
```
    output: {
        path: path.resolve(__dirname,"dist"),
        filename: "library.js",
        libraryTarget: "umd",  // amd, es6, common.js 方式引入
        library: "myLibrary",  // <script>方式引入，挂载到全局变量上面
        externals: ["lodash"]
    }
```

## PWA (服务器挂了，通过缓存，仍能展示网页)
1. webpack中实现PWA技术
- workbox-webpack-plugin
```
    const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
    
    plugins: [
        new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        })
    ]

    代码中配置详解 service-wroker.js
```

## typescritp代码约束
1. 添加代码约束 @types/lodash  @types/jquery



## eslint
1. 代码规范
```
{
    test: /\.jsx?$/,
    use: ["babel-loader","eslint-loader"]
}

devServer{
    overlay: true
}
```
2. eslint-loader
```
{
    loader: "eslint-loader",
    options: {
        fix: true
    },
    force: "pre"   // loader 先执行
}
```


## webpack优化
1. node, npm, yarn升级
2. 尽可能少的模块上应用loader  exclude include
3. 合理使用插件
4. resolve(合理)
```
resolve: {
    extensions: [".js",".jsx"],  // 文件引入时省略后缀
    mainFiles: ["index","child"],  // 目录下优先查找文件
    alias: {
        @: path.resolve(__dirname,"./src")  // 别名配置
    }
}
```
5. webpack.DllPlugin
```
* 依赖中单独一份webpack文件
new webpack.DllPlugin({
    name: "[name]",
    path: path.resolve(__dirname, "../dll/[name].manifest.json")
})

* 真正打包中的webpack文件
new AddAssetHtmlWebpackPlugin({
    filepath: path.resolve(__dirname, "./dll/vendors.dll.js")
}),
new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "../dll/vendors.manifest.json")
})

* 真正打包时，实现动态地加载
const files = fs.readdirSync(path.resolve(__dirname,"./dll"));
files.forEach(file => {
    if(/.*\.dll\.js/.test(file)) {
        plugins.push(new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, `./dll/${file}`)
        }))
    } else{
        plugins.push(
            new webpack.DllReferencePlugin({
                manifest: path.resolve(__dirname, `../dll/${file}`)
            })
        )
    }
})
```
6. thread-loader,  parallel-webpack, happypack 多进程打包
7. 合理使用sourceMap


## 多页面应用打包
1. entry
```
entry: {
    main: "./src/index.js",
    list: "./src/list.js"
}
```
2. html-webpack-plugin
```
new HtmlWebpackPlugin({
    template: "src/index.html",
    filename: "index.html",
    chunks: ["runtime","vendors","main"]
})
new HtmlWebpackPlugin({
    template: "src/index.html",
    filename: "list.html",
    chunks: ["runtime","vendors","list"]
})
```




1. UglifyJsPlugin
2. babel-plugin-lodash
3. purifycss-webpack
4. glob-all
5. performance 不显示打包性能问题


## PostCss
1. autoprefixer
2. css-nano (压缩css)
3. css-next (css的新语法， css变量,自定义选择器,calc)

## img-loader (图片压缩)
