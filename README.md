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
        chunks: "async",  // 代码块  'all'(所有代码块)   'async'(按需加载代码块)  'initial'(初始化代码块)
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
    /* webpackChunkName: 'mychunkname' */  
    /* webpackMode: lazy */
    /* webpackPrefetch: true */
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

## PostCss
1. autoprefixer
2. css-nano (压缩css)
3. css-next (css的新语法， css变量,自定义选择器,calc)

## tree-shaking
1. UglifyJsPlugin
2. babel-plugin-lodash
3. purifycss-webpack
4. glob-all

## img-loader (图片压缩)
