# 缓存

## 提取引导模板

  webpack 提供了一个优化功能, 可使用 optimization.runtimeChunk 选项将 runtime 代码 拆分为一个单独的 chunk. 将其设置为 single 来为所有 chunk 创建一个 runtime bundle.

```js
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
```

这也是因为 webpack 在入口 chunk 中，包含了某些 boilerplate(引导模板)，特别是 runtime 和 manifest。（译注：boilerplate 指 webpack 运行时的引导代码）

```js
   optimization: {
     runtimeChunk: 'single',
   },

```

将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法

```js
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
    },
  },
```

## 模块标识符[module identifier]

这是因为每个 module.id 会默认地基于解析顺序(resolve order)进行增量。也就是说，当解析顺序发生变化，ID 也会随之改变。因此，简要概括：

* main bundle 会随着自身的新增内容的修改，而发生变化。
* vendor bundle 会随着自身的 module.id 的变化，而发生变化。
* manifest runtime 会因为现在包含一个新模块的引用，而发生变化。

我们将**optimization.moduleIds**设置为 'hashed'：

现在, 不论是否添加任何新的本地依赖, 对于前后两次构建, vendor hash 都应该保持一致.
