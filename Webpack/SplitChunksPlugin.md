# code-splitting
主要有两种方式:
*     分离代码和第三方库(vendor)
*     按需加载(利用 import()语法)
第三方库代码更新迭代相对较慢且可以所版本, 所以可以充分利用浏览器的缓存来加载这些第三方库
按需加载的更典型的例子是"某些用户它们的权限只能访问某些页面", 所以没必要把他们没权限访问的页面代码也加载. 
## 原理
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
在所有的 chunk 中, app.js 和 vendor.js 都引用了 vue 和 axios
加起来两次, 都移到 vendor.js 里面
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

我们将我们导入两次的组件提取出来
```js
new webpack.optimize.CommonsChunkPlugin({
  async: 'used-twice',
  minChunks: (module, count) => (
    count >= 2
  ),
})
```

## 总结
你的 Code Splitting = webpack bundle analyzer + CommonsChunkPlugin + 你的分析