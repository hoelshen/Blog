
# 代码分离(code-splitting)

代码分离是 webpack 中最引人注目的特性之一, 此特性能够把代码分离到不同的 bundle 中,然后可以按需加载或并行加载这些文件.

主要有三种方式:

* 入口配置: entry 入口使用多个入口文件;
* 抽取公有代码: 分离代码和第三方库(vendor)
* 动态加载: 按需加载(利用 import()语法)

第三方库代码更新迭代相对较慢且可以所版本, 所以可以充分利用浏览器的缓存来加载这些第三方库
按需加载的更典型的例子是"某些用户它们的权限只能访问某些页面", 所以没必要把他们没权限访问的页面代码也加载. 

## 入口起点(entry point)

```js
  entry: {
    index: './src/index.js',
   another: './src/another-module.js',
  }
```

这样打包构建后会生成如下构建结果:

```js
another.bundle.js  550 KiB  another  [emitted]  another
  index.bundle.js  550 KiB    index  [emitted]  index

```

但是这样会有个问题:

* 如果入口 chunk 之间包含一些重复的模块, 那些重复模块都会被引入到各个 bundle 中
* 这种方法不够灵活,并不能动态的将核心应用程序逻辑中的代码拆分出来.

配置 dependOn option 选项, 这样可以在多个 chunk 之间共享模块

```js
  entry: {
     index: { import: './src/index.js', dependOn: 'shared' },
     another: { import: './src/another-module.js', dependOn: 'shared' },
     shared: 'lodash',
    }
```

## splitChunksPlugin

引入 splitChunksPlugin 插件来取代 CommonsChunksPlugin 插件.

允许我们将公共依赖项提取到现有的 entry chunk 或全新的代码块中.

每当你对某一文件做点改变，访问你站点的人们就要重新下载它。然而依赖却很少变动。如果你将（这些依赖）分离成单独的文件，访问者就无需多次重复下载它们了。

首先我们看下配置:

```js
optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,  // 匹配node_modules目录下的文件
        priority: -10   // 优先级配置项
      },
      default: {
        minChunks: 2,
        priority: -20,   // 优先级配置项
        reuseExistingChunk: true
      }
  },
}
```

将引用超过两次的模块分配到 default bundle 中,可以通过 priority 来设置优先级
将 node_modules 文件夹中的模块打包进一个叫 vendors 的 bundle 中.

* chunks: 表示哪些 chunks 里面抽离代码, 除了三个可选字符串值 initial async all 之外, 还能通过函数来过滤所需的 chunks.
  async：只處理 Lazy Loading 的 chunks，例如 import(xxx) 語法載入的模組
  initial：只處理同步加載的 chunk，例如 import xxx 語法載入的模組
  all：兼容以上兩種方式，通通進行處理
  
* minsize: 表示抽离出来的文件在压缩前的最小大小,默认为30000.
* maxsize: 表示抽取出来的文件在压缩钱的最大大小, 默认为0, 表示不限制最大大小.
* minChunks: 表示被引用次数, 默认为 1.配置成2,表示被多次引用的代码抽离成 commons.
* maxAsyncRequests: 最大的按需(异步)加载次数, 默认为5.
* maxInitialRequest: 最大的初始化加载次数, 默认为3.
* automaticNameDelimiter：抽取出来的文件的自动生成名字的分割符，默认为 ~；
* name：抽取出来文件的名字，默认为 true，表示自动生成文件名；
* cacheGroups: 缓存组。（这才是配置的关键）

我们使用 commonsChunkPlugin 将依赖2次以及以上的模块,然后移到 vendor 这个 chunk 里面.

## 示例

分离 Vendor

```js
// webpack.config.js
module.exports = {
  entry: {
    app: './src/main.js',
    vendor: ['vue', 'axios'],
  },
  plugin: [
    new CommonsChunkPlugin({
        name: 'vendor',
    }),
  ]
}
```

在所有的 chunk 中, app.js 和 vendor.js 都引用了 vue 和 axios, 加起来两次, 都移到 vendor.js 里面
最后, app.js 原本包含的 vue 和 axios 都移动到了 vendor.js

自动化分离 vendor

```js
entry: {
        // vendor: ['vue', 'axios'] // 删掉!
},

new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: ({ resource }) => (
    resource &&
    resource.indexOf('node_modules') >= 0 &&
    resource.match(/\.js$/)
  ),
}),
```

## 动态导入

  当涉及到动态代码拆分时, webpack 提供了两个类似的技术.第一种，也是推荐选择的方式是，使用符合 ECMAScript 提案 的 import() 语法 来实现动态导入。第二种，则是 webpack 的遗留功能，使用 webpack 特定的 require.ensure。

```js
 function getComponent() {
   const element = document.createElement('div');

   // Lodash, now imported by this script
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   return import('lodash').then(({ default: _ }) => {
     const element = document.createElement('div');

     element.innerHTML = _.join(['Hello', 'webpack'], ' ');

     return element;

   }).catch(error => 'An error occurred while loading the component');
  }

 getComponent().then(component => {
   document.body.appendChild(component);
 })
```

所以需要 default，是因为 webpack 4 在导入 CommonJS 模块时，将不再解析为 module.exports 的值，而是为 CommonJS 模块创建一个 artificial namespace 对象
由于 import() 会返回一个 promise，因此它可以和 async 函数一起使用。但是，需要使用像 Babel 这样的预处理器和 Syntax Dynamic Import Babel Plugin。

```js
// router.js

const Emoji = () => import(
  /* webpackChunkName: "Emoji" */
  './pages/Emoji.vue')

const Photos = () => import(
  /* webpackChunkName: "Photos" */
  './pages/Photos.vue')

```

webpack 配置

```js
output: {
  chunkFilename: '[name].chunk.js',
}
```

如果用了 babel, 则要安装

```js
{
  "plugins": ["syntax-dynamic-import"]
}
```

解决异步组件公共包
async flag

```js
// webpack.config.js

new webpack.optimize.CommonsChunkPlugin({
  async: 'common-in-lazy',
  minChunks: ({ resource } = {}) => (
    resource &&
    resource.includes('node_modules') &&
    /axios/.test(resource)
  ),
}),
```

所有的 async chunk ，就是 import() 产生的 chunk .
xxx.chunk.js 和 xxx.chunk.js 都包含了 axios ，所以把他移动到名叫 common-in-lazy 的 chunk 中
common-in-lazy chunk 并不存在，那就新建一个吧。

我们将我们导入两次的组件提取出来.

```js
new webpack.optimize.CommonsChunkPlugin({
  async: 'used-twice',
  minChunks: (module, count) => (
    count >= 2
  ),
})
```

## mini-css-extract-plugin

  用于将 css 从主应用程序中分离

  extract-text-webpack-plugin 相比：

  异步加载
  没有重复的编译（性能）
  更容易使用
  特别针对 CSS 开发

## 总结

你的 Code Splitting = webpack bundle analyzer + CommonsChunkPlugin + 你的分析

做 code splitting 的目的是为了利用浏览器的缓存.

预获取/预加载模块(prefetch/preload module

与 prefetch 指令相比，preload 指令有许多不同之处：

preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。

注意当调用 ES6 模块的 import() 方法（引入模块）时，必须指向模块的 .default 值，因为它才是 promise 被处理后返回的实际的 module 对象。

结合 Vue 的异步组件和 Webpack 的代码分割功能，轻松实现路由组件的懒加载
