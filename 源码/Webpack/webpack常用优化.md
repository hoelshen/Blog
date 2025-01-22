# webpack 打包优化

1. 优化 resolve.extensions 配置;

1. 配置时尽可能减小后缀尝试列表，不要把项目中不可能存在的情况写到列表中;

1. 频率最高的文件后缀要优先放在最前面，以做到最快推出;

1. 在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。例如在你确定的情况下把 require('./data') 写成 require('./data.json')

1. 优化 resolve.modules 配置
   resolve.modules 用于配置 Webpack 去哪些目录下寻找第三方模块。

resolve.modules 的默认值是 ['node_modules']，会采用向上递归搜索的方式查找

1. 优化 resolve.alias 配置

resolve.alias 配置项通过别名来把原导入路径映射成一个新的导入路径。

1. cache-loader
   在一些性能开销较大的 loader 之前添加 cache-loader, 将结果缓存在磁盘中,cache-loader 的配置很简单，放在其他 loader 之前即可.

1. 缩小文件匹配范围

Include：需要处理的文件的位置

Exclude：排除掉不需要处理的文件的位置

exclude 的优先级高于 include，在 include 和 exclude 中使用绝对路径数组，尽量避免 exclude，更倾向于使用 include。

1. 设置 noParse
   如果一些第三方模块没有 AMD/CommonJS 规范版本，可以使用 noParse 来标识这个模块，防止 webpack 解析那些任何与给定正则表达式相匹配的文件。忽略的文件中不应该含有 import, require, define 的调用，或任何其他导入机制。忽略大型的 library 可以提高构建性能。比如 jquery、elementUi

```js
module: {
  noParse: /jquery|lodash/;
}
```

1. 给 babel-loader 设置缓存
   babel-loader 提供了 cacheDirectory 特定选项（默认 false）：设置时，给定的目录将用于缓存加载器的结果。

1. HappyPack 的基本原理：

在 webpack 构建过程中，我们需要使用 Loader 对 js，css，图片，字体等文件做转换操作，并且转换的文件数据量也是非常大的，且这些转换操作不能并发处理文件，而是需要一个个文件进行处理，HappyPack 的基本原理是将这部分任务分解到多个子进程中去并行处理，子进程处理完成后把结果发送到主进程中，从而减少总的构建时间。

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

1. ignorePlugin

```js
//webpack.config.js
module.exports = {
  //...
  plugins: [
    //忽略 moment 下的 ./locale 目录
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};

import moment from "moment";
import "moment/locale/zh-cn"; // 手动引入
```

复制代码 index.js 中只引入 moment，打包出来的 bundle.js 大小为 263KB，如果配置了 IgnorePlugin，单独引入 moment/locale/zh-cn，构建出来的包大小为 55KB。

1. DllPlugin

用专门用于编译动态链接库, 可以将 react 和 react-dom 单独打包成一个动态链接库

1. 利用 babel 完成代码转换，并生成单个文件的依赖 2.从入口开始递归分析，并生成依赖图谱 3.将各个引用模块打包成为一个立即执行函数 4.将最终的 bundle 文件写入 bundle.js 中

## webpack 打包后输出什么
