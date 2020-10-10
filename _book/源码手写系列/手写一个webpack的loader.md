# 手写一个 webpack loader 
  我们知道loader 能够将资源变成源代码的，在 js 中通过 import 引入. loader 的作用就是将不同形式的资源处理成一段通用的 js 可执行代码，执行的结果就是导出一个模块，因为运行在 node 端，用的是 commonjs 规范，比如**module.exports={...}**

## 开始

1. test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
1. use 属性，表示进行转换时，应该使用哪个 loader。

```js
//webpack.config.js
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};

module.exports = config;
```
“嘿，webpack 编译器，当你碰到「在 require()/import 语句中被解析为 '.txt' 的路径」时，在你对它打包之前，先使用 raw-loader 转换一下。”



## 开发 loader 原则

### 单一职责

### 链式调用 

事实上串联组合中的 loader 并不一定要返回 JS 代码。只要下游的 loader 能有效处理上游 loader 的输出，那么上游的 loader 可以返回任意类型的模块。

### 模块化
保证 loader 是模块化的。loader 生成模块需要遵循和普通模块一样的设计原则。

### 无状态
在多次模块的转化之间，我们不应该在 loader 中保留状态。每个 loader 运行时应该确保与其他编译好的模块保持独立，同样也应该与前几个 loader 对相同模块的编译结果保持独立。


### 同伴依赖
如果你开发的 loader 只是简单包装另外一个包，那么你应该在 package.json 中将这个包设为同伴依赖（peerDependency）。这可以让应用开发者知道该指定哪个具体的版本。
举个例子，如下所示 sass-loader 将 node-sass 指定为同伴依赖：
"peerDependencies": {
  "node-sass": "^4.0.0"
}

### 使用 Loader 实用工具
请好好利用 loader-utils 包，它提供了很多有用的工具，最常用的一个就是获取传入 loader 的 options。除了 loader-utils 之外包还有 schema-utils 包，我们可以用 schema-utils 提供的工具，获取用于校验 options 的 JSON Schema 常量，从而校验 loader options。下面给出的例子简要地结合了上面提到的两个工具包：

```js
import { getOptions } from 'loader-utils';
import { validateOptions } from 'schema-utils';

const schema = {
  type: object,
  properties: {
    test: {
      type: string
    }
  }
}

export default function(source) {
    const options = getOptions(this);

    validateOptions(schema, options, 'Example Loader');

    // 在这里写转换 source 的逻辑 ...
    return `export default ${ JSON.stringify(source) }`;
};
```

### loader 的依赖
如果我们在 loader 中用到了外部资源（也就是从文件系统中读取的资源），我们必须声明这些外部资源的信息。这些信息用于在监控模式（watch mode）下验证可缓存的 loder 以及重新编译。下面这个例子简要地说明了怎么使用 addDependency 方法来做到上面说的事情。
```js
import path from 'path';

export default function(source) {
    var callback = this.async();
    var headerPath = path.resolve('header.js');

    this.addDependency(headerPath);

    fs.readFile(headerPath, 'utf-8', function(err, header) {
        if(err) return callback(err);
        //这里的 callback 相当于异步版的 return
        callback(null, header + "\n" + source);
    });
};

```

### 模块依赖
不同的模块会以不同的形式指定依赖。比如在 CSS 中我们使用 @import 和 url(...) 声明来完成指定，而我们应该让模块系统解析这些依赖。
如何让模块系统解析不同声明方式的依赖呢？下面有两种方法：

把不同的依赖声明统一转化为 require 声明。
通过 this.resolve 函数来解析路径。

对于第一种方式，有一个很好的例子就是 css-loader。它把 @import 声明转化为 require 样式表文件，把 url(...) 声明转化为 require 被引用文件。
而对于第二种方式，则需要参考一下 less-loader。由于要追踪 less 中的变量和 mixin，我们需要把所有的 .less 文件一次编译完毕，所以不能把每个 @import 转为 require。因此，less-loader 用自定义路径解析逻辑拓展了 less 编译器。这种方式运用了我们刚才提到的第二种方式 —— this.resolve 通过 webpack 来解析依赖。

如果某种语言只支持相对路径（例如 url(file) 指向 ./file）。你可以用 ~ 将相对路径指向某个已经安装好的目录（例如 node_modules）下，因此，拿 url 举例，它看起来会变成这样：url(~some-library/image.jpg)。


### 代码公用
避免在多个 loader 里面初始化同样的代码，请把这些共用代码提取到一个运行时文件里，然后通过 require 把它引进每个 loader。
```js
function parse(source){



}
```

## demo

到这里，对于「如何开发一个 loader」，我相信你已经有了自己的答案。总结一下，一个 loader 在我们项目中 work 需要经历以下步骤：

* 创建 loader 的目录及模块文件
* 在 webpack 中配置 rule 及 loader 的解析路径，并且要注意 loader 的顺序，这样在 require 指定类型文件时，我们能让处理流经过指定 laoder。
* 遵循原则设计和开发 loader。


```js
var Minimize = require('minimize');
var loaderUtils = require('loader-utils');

module.exports = function (source) {
  var callback = this.async();
  if (this.cacheable) {
      this.cacheable();
  }


  var options = loaderUtils.getOptions(this) || {}; //这里拿到 webpack.config.js 的 loader 配置

  var minimize = new Minimize(options);
  return minimize.parse(source, callback);
}

```