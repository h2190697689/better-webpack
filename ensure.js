/**
 * 代码分隔，异步加载
 */
require.ensure(["lodash"],function(){   // 这里的lodash可以省略
    var _ = require("lodash");
},"vendor")   //最后一个参数为chunkname(可不指定)
require.include("lodash")


import("lodash").then(function(_){
    console.log(_.join([1,2,3],"-"))
})