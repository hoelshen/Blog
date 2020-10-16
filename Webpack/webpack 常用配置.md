# 基础配置

1. entry
2. output
3. mode
4. loader
5. plugin


常见术语: 生成(emitted 或 emit)贯穿了我们整个文档和插件 API。它是“生产(produced)”或“释放(discharged)”的特殊术语。

## 入口(entry)
入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。


## 出口(output)
output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。基本上，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中。你可以通过在配置中指定一个 output 字段，来配置这些处理过程


## loader
loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。


## 插件(plugins)
loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

## 模式

通过选择 development 或 production 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化

```js
module.exports = {
  mode: 'production'
};
```

下面是webpack配置时的一些概念

Entry

入口文件是webpack建立依赖图的起点。

Output

Output配置告诉webpack怎么处理打包的代码。

Hot Module Replacement

热模块替换功能可以在不刷新所有文件的情况下实现单独跟新某个模块。

Tree Shaking

去除无用代码，比如某个js文件里的函数并没有被使用，这段函数代码在打包时将会被去掉。

Code Splitting

代码拆分，实现的方式有三种

Entry Points 手动把代码分成多个入口
Prevent Duplication 使用插件CommonsChunkPlugin提取公共代码块
Dynamic Imports 用import函数动态动引入模块
Lazy Loading

懒加载或者按需加载，属于Code Splitting的一部分

Loaders

webpack把所有文件都当成模块对待，但是它只理解Javascript。Loaders把这些webpack不认识的文件转化成模块，以便webpack进行处理。

plugins

插件一般用来处理打包模块的编译或代码块相关的工作。

The Manifest

webpack manifest文件用来引导所有模块的交互。manifest文件包含了加载和处理模块的逻辑。

当webpack编译器处理和映射应用代码时，它把模块的详细的信息都记录到了manifest文件中。当模块被打包并运输到浏览器上时，runtime就会根据manifest文件来处理和加载模块。利用manifest就知道从哪里去获取模块代码。

  在插件开发中最重要的两个资源就是 compiler 和 compilation 对象.
  compiler 对象代表了完整的 webpack 环境配置. 这个对象在启动 webpack 时被一次性建立, 并配置好所有可操作的设置, 包括 options, loader 和 plugin.

  compilation 对象代表了一次资源版本构建. 当运行 webpack 开发环境中间件时, 每当检测到一个文件变化, 就会创建一个新的 compilation, 从而生成一组新的编译资源. 一个 compilation 对象表现了当前的模块资源\编译生成资源\变化的文件\以及被跟踪依赖的状态信息.compilation 对象也提供了很多关键时间的回调, 以供插件做自定义处理试选择使用

  同样的compilation钩子也是继承自Tapable，那么它也具有compiler的同样的方法和特性。Compilation 模块会被 Compiler 用来创建新的编译（或新的构建）。Compiler可以理解为整个webpack生命周期都存在的编译[构建]对象，但是Compliation只代表着某一次的编译[构建]对象

## webpack基础知识

entry

output

hot module replacement

tree shaking

code splitting

lazy loading

loaders

plugin

the manifest
