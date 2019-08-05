# Babel 你太美

## 为什么要用 Babel

  Babel 的本意是 “通天塔”。 西方神话故事里，以前的人语言相同，决定建立有个能直达上天的塔，神后面惧怕人们语言相通就打乱它，让他们不能明白对方的意思，并把他们分散到各地。

   为了解决上古时代浏览器对新语法不支持、不兼容情况下。发明了 Babel ，能够将 ES6 代码 转为 ES5 代码， 从而在现有环境执行。

## 安装环境

  我们将 Babel 想象成 一只多功能的笔，而我们的配置项，就是我们赋予笔的功能，例如：像水彩笔、像铅笔、像圆珠笔，每种笔在它的使用环境下使用。

``` js
//这些是babel 的核心
yarn add --save-dev @babel/core @babel/cli @babel/preset-env
yarn add --save @babel/polyfill
```

```js
babel.config.js

const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets };

```

执行方法

```js
./node_modules/.bin/babel src --out-dir lib  或者  npx babel
```

## 运行原理

  babel 在进行解析时如下

```js
  input string -> @babel/parser parser -> AST -> transformer[s] -> AST -> @babel/generator -> output string

  用大白话讲一下就是以炒菜为例子， 我们需要将菜放到锅里面乱炖。 babel/core, 就是炒菜的这个过程。 babel/cli 是锅，我们可以在上面炒任何菜（我们的代码）， 我们在炒的过程，希望全自动炒菜，bable/plugin 就是提供的工具，当我们直接照着菜单自动炒的时候，就是 babel/preset-env。 有时候这个锅可能要用电，用煤气，我们就用 babel/proyfill 做个接口兼容。让他可以用电、用煤气。 后来发现这个接电就能用，这时候 babel/runtime 就能解决，遇到要接电的才转。


  ok，再说都饿了。

  我们再来梳理下：

  @babel/core 转换ast

  @babel/cli 打包工具

  @babel/plugin 插件机制，手动增加

  @babel/preset-env 配置环境

  @babel/polyfill 提供某些api，包含所需整个运行环境。

  @babel/runtime 按需载入所需api。

```

### Plugins & Presets

  你能够单独引一个 js 语法特性插件做处理，例如箭头函数。应用场景在例如一个新的提案出来的时候，尝尝鲜，正常有装我们的 Babel 全家桶足以应付了。

  npm install --save-dev @babel/plugin-transform-arrow-functions

  npx babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions.

```js

const fn = () => 1;

// converted to

var fn = function fn() {
  return 1;
};


```

  preset 是预设的意思，像插件一样，你也可以设置自己的预设，以共享需要的任何插件组合，

  npm install --save-dev @babel/preset-env

  npx src --out-dir lib --presets=@babel/env

  这个预设将支持 ES6, ES7 的所有插件。 而且预设也可以做配置， 我们可以通过配置文件

```js
const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
    },
  ],
];

module.exports = { presets };

```

  tansform-runtime
  
  转换器它的作用是避免编译输出中的重复。运行时将编译到您的构建中。
  还有另一个作用是为代码创建沙盒环境，如果直接导入 core-js 或者 babel/prolyfill。

  npm install --save-dev @babel/plugin-transform-runtime
  npm install --save @babel/runtime

  变换器将这些内置函数为core-js， 而不需要使用polyfill

```js

{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}

```

### polyfill

  env 预设仅加载我们的目标浏览器中不可用的功能转换插件。
  @babel/prolyfill模块包括core.js和自定义 regenerator，模拟完成的 es2015 环境。
  也就是说你可以使用内置函数，静态方法等。

  npm install --save @babel/polyfill

 Babel 是处于构建期， 转译出来的结果在默认下并不包括 ES6 对运行时的扩展，例如 builtins , 内建类型上的原型扩展 Array、Object、String ，Regenerator 等。

  api 指的是我们可以通过函数重新覆盖的语法，例如 Promise，includes等。

  syntax， 指的是let， const， class等， 无法重写。

  所以需要 plyfill 来处理。
  
  polyfill 与 transform-runtime 的区别。

  babel-runtime 库 是由Babel提供的polyfill库， 它本身就是由core-js 与 regenerator-runtime 库组成。

 我们可以通过 babel-plugin-transform-runtime 进行引用

## babel 配置

configuration配置方法 可以有以下情况：

* .babelrc (and .babelrc.js) files
* package.json files with a "babel" key

## babel 与 react 常见配置

yarn add @babel/preset-es2015  @babel/preset-react  - -save-dev

yarn add @babel/preset-react-hmre  - -save -dev

```json

.babelrc
{
"presets":[
  "es2015",
  "react",
  "@babel/preset-env"],
"env":{
    "development":{
      "presets":["react-hmre"]
    }
  }
//
}
```

## babel 与 TypeScript

yarn add @babel/plugin-tansform-typescript
yarn add @babel/preset-typescript

```json
{
  "presets": ["@babel/preset-typescript"]
}

配置清单




```

## babel 还能做什么

## 后记

[@babel/core](https://babeljs.io/docs/en/babel-core)

[babel options api](https://babeljs.io/docs/en/options)

[babel.config.js](https://github.com/babel/babel/blob/master/babel.config.js)

[babel/core.js](https://github.com/zloirock/core-js)

[babel regenerator-runtimer](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js)
