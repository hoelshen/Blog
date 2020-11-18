# roullp 解析

## 原理解析

高版本浏览器支持 es6 了
所以我们可以直接使用

``` js
// index.js
function logA() {
    console.log('function logA called');
}

var index = logA();

export default index;


```

```js
<script type = "module" >
    import index from './index.js'
console.log('logA: ', index); <
</script>
```
## CommonJs

``` js
// For the browser
# compile to a < script > containing a self - executing
function('iife')
$ rollup main.js--flie bundle.js--format iife
```

``` js
For Node.js
# compile to a CommonJS module('cjs')
$ rollup main.js--file bundle.js--format cjs
```

``` js
For browsers and Node.js
# UMD format requires a bundle name
$ rollup main.js--file bundle.js--format umd--name "myBundle"
```

``` js
For es module
$ rollup. / src / main.js--file. / dist / bundle.js--format es
```

``` js
// 使用 CommonJS，必须导入整个库

// Import a full utils object using CommonJS
var utils = require('utils');
var query = 'Rollup';
// Use the ajax method of the utils object
utils.ajax('https://api.example.com?search=' + query).then(handleResponse);

// 使用 ES6 module，无须导入整个库

// Import ajax function using the ES6 import statement
import {
    ajax
} from 'utils';
var query = 'Rollup';
// Calling ajax function
ajax('https://api.example.com?search=' + query).then(handleResponse);
```

rollup 默认打包出 es, 而不是 cjs 主要会进行如下考虑
Tree-shaking
也称为：live code inclusion
使用 Rollup 处理代码模块, 采用 ES6 标准（使用 import/export），可以对模块文件进行静态分析，并可以排除任何未实际使用的代码

## 为什么 ES Module 要优于 CommonJS

ES Module 是官方标准，有一个直接清晰的发展方向
CommonJS 只是在 ES Module 出现之前的一个特殊的暂时性的传统E标准
ES Module 可以对文件进行静态分析，进行 Tree-shaking 优化
ES Module 提供了更高级的特性，如，循环引用和动态绑定

## Rollup

Rollup 以不同的目的被创建，Rollup 目的是要尽可能的高效的构建扁平的可分配的 Javascript libraries，充分使用 ES Module 的优点, 会将所有代码放在同一个位置统一进行验证，更快的生成更轻量级的代码。Rollup 不支持 code-splitting，HMR，而且处理 CommonJS 时需要插件。

Webpack 支持 code-splitting , 实现了一个浏览器友好的 require ，将每个模块一个接一个的验证再打包。如果需要  on-demand loading，会很好；否则会造成性能浪费，尤其如果打包大量模块时，性能较差。

结论：
Use webpack for apps, and Rollup for libraries

如果你需要 code-splitting，有很多  static assets，需要使用很多 CommonJS 依赖，使用 Webpack
如果你的 codebase 是ES Module，写一些给其他人使用的代码或库，那么使用 Rollup

## 参考文献

[](https://juejin.im/post/6844903924776828942)
