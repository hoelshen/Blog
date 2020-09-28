
# 区分

## bundle

 这个词的 中文意思:n. 束；捆
 多个不同的模块生成，bundles 包含了早已经过加载和编译的最终源文件版本。 **Bundle 分离（Bundle Splitting）:**这个流程提供了一个优化 build 的方法，允许 webpack 为应用程序生成多个 bundle。最

## Module

  这个词的中文意思:模块
  **提供比较完整程序接触面（surface area）更小的离散功能块。精心编写的模块提供了可靠的抽象和封装界限，使得应用程序中每个模块都具有条理清楚的设计和明确的目的。

## Chunk
  Chunk这是 webpack 特定的术语被用在内部来管理 building 过程。bundle 是由 chunk 组成，其中有几种类型（例如，入口 chunk(entry chunk)和子 chunk(child chunk)）。


module 就是没有被编译之前的代码，通过 webpack 的根据文件引用关系生成 chunk 文件，webpack 处理好 chunk 文件后，生成运行在浏览器中的代码 bundle。

在 webpack 构建的典型应用程序或站点中,有三种主要的代码类型:

1. 你或你的团队编写的源码
1. 你的源码会依赖的任何第三方的 library 或 vendor 代码
1. webpack 的 runtime 和 manifest,管理所有模块的交互.


## runtime
  runtime 包含：在模块交互时，连接模块所需的加载和解析逻辑。包括浏览器中的已加载模块的连接，以及懒加载模块的执行逻辑。


## Manifest
那么，一旦你的应用程序中，形如 **index.html** 文件、一些 bundle 和各种资源加载到浏览器中，会发生什么？你精心安排的 /src 目录的文件结构现在已经不存在，所以 webpack 如何管理所有模块之间的交互呢？这就是 manifest 数据用途的由来...

当编译器(compiler)开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。这个数据集合称为 "Manifest"，当完成打包并发送到浏览器时，会在运行时通过 Manifest 来解析和加载模块。无论你选择哪种模块语法，那些 import 或 require 语句现在都已经转换为 __webpack_require__ 方法，此方法指向模块标识符(module identifier)。通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块


通过使用 bundle 计算出内容散列(content hash)作为文件名称，这样在内容或文件修改时，浏览器中将通过新的内容散列指向新的文件，从而使缓存无效。一旦你开始这样做，你会立即注意到一些有趣的行为。即使表面上某些内容没有修改，计算出的哈希还是会改变。这是因为，runtime 和 manifest 的注入在每次构建都会发生变化。

## hash|chunkhash|contenthash

* hash





* chunkhash
  采用hash计算的话，每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。这样子是没办法实现缓存效果，我们需要换另一种哈希值计算方式，即 chunkhash。
  chunkhash 和 hash 不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。 
  
  我们把一些公共库和程序入口文件区分开,单独打包构建,接着我们采用 chunkhash 的方式生成哈希值,那么只要我们不改动公共库的代码,就可以保证其哈希值不会受影响




* contenthash
  在 chunkhash 中, 由于 index.css 和 index.js 引用了.所以共用的 chunkhash 值. 但是这样子有问题,如果 index.js 改变,css 没有变化,也会导致 css 文件会重复构建.
  我们可以使用 extra-text-webpack-plugin 里的 contenthash 值, 保证即使 css 文件所有的模块里就算其他文件内容改变,只要 css 文件内容不变,那么不会重复构建.



## 总结: 
hash 所有文件哈希值相同； chunkhash 根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值； contenthash 计算与文件内容本身相关，主要用在css抽取css文件时。