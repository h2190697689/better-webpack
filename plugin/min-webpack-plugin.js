/**
 * @author hejiamin
 * @description 编写自己的plugin
 * @date 2020/5/23
 */

 class MinWebpackPlugin{
    constructor(options){
        
    }

    apply(compiler){
        compiler.hooks.emit.tapAsync(  // 异步，tap为同步
            'MinWebpackPlugin',
            (compilation, callback) => {
            //   compilation.addModule(/* ... */);
            // debugger   --inspect   --inspect-brk
            compilation.assets["min.txt"] = {
                source: function(){
                    return "min"
                },
                size: function(){
                    return 3;
                }
            }
            callback();
            }
          );
    }
 }