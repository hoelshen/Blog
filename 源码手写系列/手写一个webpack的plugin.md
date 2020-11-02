# Plugin
一、Plugin 是什么，有什么用

是 webpack 用于在编译过程中利用钩子进行各种自定义输出的函数；本质上就是一个 node 模块，通过写一个类来使用编译暴漏出来的钩子实现编译过程的可控；由此我们就可以在开发模式下，可以通过监听编译过程的各个钩子事件来完成如释出模版，对 js、css、html 进行压缩、去重等各类操作，结束后释出对应文件等等你可以想到的任何操作

webpack 的插件简单来说就是在函数中通过调用 webpack 执行的钩子来完成自动化的过程，在函数中我们通过监听 compiler 钩子，并在回调中执行我们需要做的事情，最后调用回调中的第二个参数 callback 使 webpack 继续构建，否则将在此处停止编译，整个过程都是在 webpack 的整个编译过程中利用其暴漏出的钩子进行的.

webpack 的核心包有 compiler 模块和 compilation 模块。

compiler 模块主要提供 webpack 的配置信息（options，loaders，plugins 等），打包启动时被一次性构建。compiler 拓展自 tapable 类，这个类暴露了多种 hooks 函数。

compilation 也是继承自 Tapable 类。有着父类相同的特性和方法。compilation 会被 compiler 用来创建新的编译。每次检测到文件变化，就会生成一组新的编译资源。
一个 compilation 对象表示当前模块信息，编译生成资源，变化的文件以及被跟踪依赖的状态信息。compilation 也提供了很多关键的回调以供插件使用。

书写一个 plugin 包含以下几步

1. 一个 JavaScript 函数或者类
1. 在函数原型（prototype）中定义一个注入compiler对象的apply方法。
1. apply函数中通过compiler插入指定的事件钩子，在钩子回调中拿到compilation对象
1. 使用 compilation 操纵修改 webpack 内部实例数据。
1. 异步插件，数据处理完后使用 callback 回调

```js



```

## 原理

  插件就是钩子在不同的生命周期做的方法

  ```js
  initHooks() {
    // 配置钩子
    this.hooks = {
        entryOption: new SyncHook(),
        compile: new SyncHook(),
        afterCompile: new SyncHook(),
        afterPlugins: new SyncHook(),
        run: new SyncHook(),
        emit: new SyncHook(),
        done: new SyncHook()
    }
  }
  ```

  然后我们配置一个注册调用 plugins 的方法

  ```js
  handlePlugins() {
    // 处理插件
    let { plugins } = this.config
    if (Array.isArray(plugins)) {

        plugins.forEach((plugin) => {
            plugin.apply(this) // 每个插件里面都会有一个apply方法来调用
        })
        this.hooks.afterPlugins.call(this)
    }
  }
  ```

  继续修改启动项:
  
  ```js
  // 运行模块
  start(){
    this.hooks.run.call(this)
    this.hooks.compile.call(this)

    this.buildModules(path.resolve(this.root, this.entry),this.entry)

    this.hooks.afterCompile.call(this)

    this.writeFile()

    this.hooks.emit.call(this)
    this.hooks.done.call(this)
  }
```

```js
//新建MyWebpackPlugin.js
const { compilation } = require("webpack");
class myWebpackPlugin {

  //option是在导入插件时，可以传入的参数
  constructor(option){

  }
  // 这里也可以传入function
  constructor(donecallback,failedcallback){
      this.donecallback = donecallback;
      this.failcallback = failcallback;
  }
  apply(compiler){
    //当webpack完成构建并输出后，在退出webpack前触发
    compiler.plugin('done',(state)=>{
      console.log("webpack打包成功");
      this.donecallback(state);
    });
    //当webpack完成构建异常导致失败，在退出webpack前触发
    compiler.plugin('failed',(state)=>{
      console.log("webpack打包失败");
      this.failedcallback(state);
    })
  }
}

module.exports = myWebpackPlugin;




```


