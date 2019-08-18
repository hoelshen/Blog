# import与export

  混乱时期 ---- 社区规范
  CommonJs 分为两个派系
 `*` 服务端
  modules/1.x
     modules/async  
 `*` browserify
  AMD\UMD   代表有requireJs和seaJs

## commonjs 规范的核心内容

  1. module.exports 定义模块
  2. 通过 require 关键字引用模块


  ES6时期
  设计思想是尽量端静态化， 编译时就能确定模块的依赖关系，以及输入和输出的变量。而 CommonJs 和 AMD 模块，都只能在运行时确定这些东西。

  ```js
  // CommonJS模块
  let { stat, exists, readFile } = require('fs');

  // 等同于
  let _fs = require('fs');
  let stat = _fs.stat;
  let exists = _fs.exists;
  let readfile = _fs.readfile;

  ```
  加载的是整个 fs 对象，再从这个对象上读取 3 个方法。 这种加载称为“运行时加载”，只有运行时才能得到这个对象，没有办法做到编译时“静态优化”


益处：
 `-` 编译加载，能够静态分析。 能够引入宏 (marco) 和类型检查 (type system)。
 `-` 不在需要 umd 模块格式了，将来服务器和浏览器都会支持 ES6 模块格式。
 `-` 不再需要对象作为命名空间（比如Math对象），未来这些功能可以通过模块提供。
弊处：
  没法引用 ES6 模块本身，因为他不是对象。


在 ES6 模块中，顶层的 this 指向 undefined,即不应该在顶层代码中使用 this

⚠️：export 对外输出的是接口

```js
  export 1  

  var m = 1;
  export m

  上面两种没有提供对外的接口， 都是直接输出值 1。 而不是输出接口

  它们的实质是，在接口名与模块内部变量之间，建议一一对应关系.
export 语句输出的接口， 与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
Commjs 模块输出的是值的缓存， 不存在动态更新。

```

⚠️：import 加载模块的接口

  import 命令接受一堆大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块对外接口保持一致。

  import 命令是只读的，因为它的本质是输入接口

```js

import {a} from './xxx.js'

a = {}; // Syntax Error : 'a' is read-only;


import {a} from './xxx.js'

a.foo = 'hello'; // 合法操作

因为 a 是一个对象，修改 a 的属性是允许的。

```

import 后面的 from 指定模块文件的位置， 可以是相对的路径，也可以是绝对的，.js 后缀可以省略。如果只是模块名，不带路径，那么必须要有配置文件，告诉 JavaScript 引擎该模块的位置

```js
//webpack.config.js
alias: {
  xx: path.resolve(__dirname, 'src/components/xx.js',
}

```

import 是静态执行， 不能使用表达式和变量。这些只有运行时才能得到结果的语法解构。

```js
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}


```

很遗憾的是现在所有的浏览器都不支持 import 和 export

import 命令具有提升效果， 会提升到整个模块的头部，首先执行。


  node.js是基于commonjs规范的
  exports是一个特殊的对象，它的任何输出都将对作为一个对外暴露的公共api.

  exports 用来导出模块 包括标识符（identify）和模块内容（contents）
  module.export对外导出的对象只能有1个
  exports.xxx 对外导出的值可以有多个


  exports 多用于编写对外暴露多个api的工具类代码
  module.exports用于编写对外暴露同一个对象api 的代码


### export

```js
//default
export default {}
export default class{}
export default class foo{}
export default function foo{}
```

```js
//variables exports
export var foo = 1;
export var foo = function(){};
export var bar;
export let foo = 2;
export const foo = 3;

```

```js
// name exports
export {foo}
export {foo, bar}
export {foo as bar}
export {foo as default}
export {foo as default, bar}

```

没有用export标示的一切都在模块作用域内部保持私有。


```js
commonsjs 分为

```

### import

```js
export default{
  foo(){},
  bar(){}
}
```

这个模式，js引擎无法静态分析平凡对象的内容， 这意味着它无法对静态import 进行性能优化。让每个成员独一且显示的导出的有点是引擎可以对其进行静态分析和优化

我们可以采用
```js
export default function foo(){}
export function bar(){}
export function baz(){}
或者
function foo(){}
function bar(){}
function baz(){}

export{ foo as default, bar, baz, ... }
```

  为了解决
  从模块把所有一切导入到一个单独命名空间，而不是向作用域直接导入独立的成员。 命名空间导入

```js
import * as foo from './export.js'
foo.bar()

foo.x;

foo.baz();

```
注意点： 命名空间要么全有要么全无

```js
  import { bar, baz } as foo from 'foo'

```

### 模块依赖环

  require 还有按需加载的含义， 当多次引用一个模块的时候，该模块只会被加载一次，其他情况下都在缓存中加载，不需要重新加载


  模块间的循环引用

  require返回的对象必须至少包含此外部模块在调用require
  函数之前就已经准备完毕的输出

```js
  module A
  import bar from 'B'

  export default function foo(x){
    if(x > 10) return bar(x-1)
    return x*2
  }

  module B
  import foo from 'A'

  export default function bar(y){
    if(y >5) return foo(y/2)
    return y*3
  }

```
  如果先加载模块A，第一步是扫描这个文件分析所有导出，注册所有可以导入的绑定。然后处理 import .. from 'B'。
  引擎加载”B“之后，会对它的导出绑定进行同样的分析。当看到import .. from "A"，它已经了解"A"的api，所以可以验证import是否有效。现在它了解'B'的api， 就可以验证等待的“A”模块中import .. from 'b'的有效性

![这是更详细的例子](http://pvt7l4h05.bkt.clouddn.com/2019-08-12-modulelLoading.png)


## require

  浏览器端还不支持require
  require  是一个函数  参数是模块表示
  require 函数的返回值是module.exports对象


### 模块加载

环境提供的默认模块加载起会把模块标识符解析为URL