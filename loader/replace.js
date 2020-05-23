/**
 * @author hejiamin
 * @description 手动编写loader
 * @date 2020/5/23
 */
import { getOptions } from 'loader-utils';
module.exports = function(source,map,meta){  //不能使用箭头函数，需要使用this
    const options = getOptions(this);  // 获取options 内容
    return source.replace("name","age")
}

//  this.callback(null, someSyncOperation(content), map, meta);  可传递更多内容
// this.async  异步操作