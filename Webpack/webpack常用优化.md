# webpack 打包优化

1. 优化resolve.extensions配置;

1. 配置时尽可能减小后缀尝试列表，不要把项目中不可能存在的情况写到列表中;

1. 频率最高的文件后嘴要优先放在最前面，以做到最快推出;

1. 在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。例如在你确定的情况下把 require('./data') 写成 require('./data.json')

1. 优化 resolve.modules 配置
resolve.modules 用于配置 Webpack 去哪些目录下寻找第三方模块。

resolve.modules 的默认值是 ['node_modules']，会采用向上递归搜索的方式查找

1. 优化resolve.alias配置

resolve.alias 配置项通过别名来把原导入路径映射成一个新的导入路径。

1. 缩小文件匹配范围

Include：需要处理的文件的位置

Exclude：排除掉不需要处理的文件的位置

1. 设置noParse
防止 webpack 解析那些任何与给定正则表达式相匹配的文件。忽略的文件中不应该含有 import, require, define 的调用，或任何其他导入机制。忽略大型的 library 可以提高构建性能。比如jquery、elementUi

1. 给babel-loader设置缓存
babel-loader 提供了 cacheDirectory 特定选项（默认 false）：设置时，给定的目录将用于缓存加载器的结果。

1. HappyPack的基本原理：

在webpack构建过程中，我们需要使用Loader对js，css，图片，字体等文件做转换操作，并且转换的文件数据量也是非常大的，且这些转换操作不能并发处理文件，而是需要一个个文件进行处理，HappyPack的基本原理是将这部分任务分解到多个子进程中去并行处理，子进程处理完成后把结果发送到主进程中，从而减少总的构建时间。

1. 异步加载 css

运行时代码通过 <link> 或者<style> 标签检测已经添加的 CSS。

```js
function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  optimization: {
    splitChunks: {
      cacheGroups: {
        fooStyles: {
          name: 'foo',
          test: (m,c,entry = 'foo') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true
        },
        barStyles: {
          name: 'bar',
          test: (m,c,entry = 'bar') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true
        }
      }
    }


```

1. 生产模式压缩

```js
  const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`
      new CssMinimizerPlugin(),
    ],
  },
```
