
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