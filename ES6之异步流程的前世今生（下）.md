# ES6之异步流程的前世今生（下）

## generator/co

讲之前先来看一个es6的东西

``` javascript
  function* foo() {
      yield 1;
      yield 2;
      yield 3;
      return console.log(4)
  }

  var it = foo();
  it.next();
  it.next();
  it.next();
  it.next(); //4
```

``` javascript
function *doSomething() {

    console.log(‘start’)
    yield
    console.log(‘finish’)

}
var func1 = doSomething();
func1.next();
func1.next();

function* getStorckPrice(stock) {

    while (true) {
        yield Math.random() * 100;
    }

}
var priceGenerator = getStockPrice(‘IBM’);
var limitPrice = 15;
var price = 100;
while (price > limitPrice) {
    price = priceGenerator.next().value;
    console.log( `this generator return ${price}` );
}
console.log( `buying at ${price}` );

```

### generator 原理

 我们 Google 了一下，这个是 facebook 下的一个工具：regeneratorRuntime ，用于编译 ES6 的 generator 函数。

我们进行下载

``` js
  npm install - g regenerator
```

  然后创建一个generator, js文件

``` js
    function* hiGenerator() {
        yield '1';
        yield '2';
        return '3';
    }
```

  执行以下代码

``` js
  regenerator geberator.js > generator - es5.js
```

  以下称为编译简单版， 这个肯定是不能跑的，因为有我们遇到的 regeneratorRuntime。wap.

``` js
    "use strict";

    var _marked =
        /*#__PURE__*/
        regeneratorRuntime.mark(hiGenerator);

    function hiGenerator() {
        return regeneratorRuntime.wrap(function hiGenerator$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return '1';

                    case 2:
                        _context.next = 4;
                        return '2';

                    case 4:
                        return _context.abrupt("return", '3');

                    case 5:
                    case "end":
                        return _context.stop();
                }
            }
        }, _marked);
    }
```

主要用到迭代器的 Iterator.next 的调用。

regenerator --include-runtime  geberator.js  > generator-es5.js

或者可以得出一个编译后 700 多行的点东西，我们抽离除主要逻辑

``` js
var _marked =
    /*#__PURE__*/
    regeneratorRuntime.mark(hiGenerator);
```

  还有

``` js
  function hiGenerator() {
      return regeneratorRuntime.wrap(function hiGenerator$(_context) {
          while (1) {
              switch (_context.prev = _context.next) {
                  case 0:
                      _context.next = 2;
                      return '1';

                  case 2:
                      _context.next = 4;
                      return '2';

                  case 4:
                      return _context.abrupt("return", '3');

                  case 5:
                  case "end":
                      return _context.stop();
              }
          }
      }, _marked);
  }
```

  接下来我们看一下 mark 函数
  
``` js
    exports.mark = function(genFun) {
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
            genFun.__proto__ = GeneratorFunctionPrototype;
            if (!(toStringTagSymbol in genFun)) {
                genFun[toStringTagSymbol] = "GeneratorFunction";
            }
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
    };
```

  里面 GeneratorFunctionPrototype 和 Gp 变量, 我们查看对应的代码：

  function Generator(){}

  function GeneratorFunction(){}

  ![ES6](https://user-gold-cdn.xitu.io/2019/8/14/16c8f166fb115b5c?w=1722&h=1506&f=png&s=203226)

  它们的作用就是维持关系链，跟原生的保持一致。例如：

``` js
    function* f() {}
    var g = f();
    console.log(g.__proto__ === f.prototype); // true
    console.log(g.__proto__.__proto__ === f.__proto__.prototype); // true
```

 我们将 next、throw、return 函数怪哉gp对象上。

``` js
  function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
          prototype[method] = function(arg) {
              return this._invoke(method, arg);
          };
      });
  }
```

``` js
function wrap(innerFn, outerFn, self, tryLocsList) {

    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
}
```
  所以当我们 hell = hllGenerator() 的时候，执行的其实是 wrap 函数，wrap 函数返回一个 generator， generator 对象，她有 outerFn、outerFn. 其实就是genFun.prototype, getFun.prototype 是一个控对象，原型上面有next（）方法。hell.next() 的时候，其实是 generator._invoke = makeInvokeMethod(innerFn, self, context);
这里的 innerFun 就是wrap 包裹的函数。hiGenerator接下来我们看一下 makeInvokeMethod 函数里面的主要功能是 invoke 函数 根据不同的context状态来进行相应的操作。hi.next()=>record=> innerFn.call(self, context)=>abrupt，我们 record 对象。这个对象有 complete 方法。
 
 

---------------------------------------------------------------------------------------

语法上generator,有两个特征：

- function 关键字与函数名之前有一个星号.

- 函数体内部使用yield关键字，定义不同的内部状态。

  generator 本意是 iterator 生成器，函数运行到yield时退出，并保留上下文。控制函数的执行过程，手工暂停和恢复代码执行.
generator 的弊端是没有执行器，本身也不是为流程控制而生的，所以出现了co
co 是 tj 大神开发的库 [github地址](https://github.com/tj/co)

```js
  const co = require('co')
  const Promise = require('bluebird')

  const fs = Promise.promisifyAll(require('fs'))

  async function main(){
    const contents = co(function*{
      var result = yield.fs.readFilAsyn('myfiles.js', 'utf8')
      return result;
    })
  }

```

## async/await

async 函数的执行过程

1）await帮我们处理了 promise，要么返回兑现的值，要么抛出异常；

2）await在等待 promise 兑现的同时，整个 async 函数会挂起，promise 兑现后再重新执行接下来的代码。

``` javascript
const readAsync = util.promisify(fs.readFile)
async function init() {
    let data = await readAsync('./package-lock.json')
    data = JSON.parse(data)
    console.log(data.name)
}
init()
```

### async/await 原理

我们用 babel 编译下，async/await转换出什么。

``` js
//源代码
function tell() {
    return new Promise((reslove, reject) => {
        if (true) {
            reslove(1)
        } else {
            reject(2)
        }
    })
}

var a = (
    async () => {
        await tell().then((res) => {
            console.log('res', res);
        }).catch(err => {
            console.log('err: ', err);
        })
    }
)
console.log('a', a())

//转换后的
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function() {
        var self = this,
            args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);

            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }

            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

function tell() {
    return new Promise(function(reslove, reject) {
        if (true) {
            reslove(1);
        } else {
            reject(2);
        }
    });
}

var a =
    /*#__PURE__*/
    function() {
        var _ref = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return tell().then(function(res) {
                                    console.log('res', res);
                                })["catch"](function(err) {
                                    console.log('err: ', err);
                                });

                            case 2:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee);
            }));

        return function a() {
            return _ref.apply(this, arguments);
        };
    }();

console.log('a', a());
```

  yeah，瞬间好长一串，不过莫慌。我们先理性（慌张）分析一波。
  它先定义了 三个个函数 asyncGeneratorStep、 _asyncToGenerator、tell
  wow， 我们发现就tell这个函数我们看的懂，而且很熟悉， Promsie（不熟悉的先去补补上面的知识），ok，
  在看剩下来的两个函数。我们大概分析下，asyncGeneratorStep 这个应该是根据不同的状态我们要怎么处理（做具体的事情）。 _asyncToGenerator、tell 这个函数呢，则是将传入的函数变量做分配处理，起分配作用。（不做具体事情）。

  接来下我们看看 a定义的这个主函数。整个采用了switch模式，根据不同的状态，分发事件。

  根据以上原理 我们可以写一个简易版的

  ```js
  var myAsync = generator => {
    // 注意 iterator.next() 返回对象的 value 是 promiseAjax()，一个 promise
    const iterator = generator();

    // handle 函数控制 async 函数的 挂起-执行
    const handle = iteratorResult => {
      if (iteratorResult.done) return;

      const iteratorValue = iteratorResult.value;

      // 只考虑异步请求返回值是 promise 的情况
      if (iteratorValue instanceof Promise) {
        // 递归调用 handle，promise 兑现后再调用 iterator.next() 使生成器继续执行
        iteratorValue
          .then(result => handle(iterator.next(result)))
          .catch(e => iterator.throw(e));
      }
    };

    try {
      handle(iterator.next());
    } catch (e) {
      console.log(e);
    }
  };

  myAsync(function*() {
    try {
      const a = yield Promise.resolve(1);
      const b = yield Promise.reject(a + 10);
      const c = yield Promise.resolve(b + 100);
      console.log(a, b, c); // 输出 1，11，111
    } catch (e) {
      console.log("出错了：", e);
    }
  });

  ```

generator()生成它的控制器。接着调用 handle 函数，并传入 interator.next()， 接着遇到 yield 生成器再次挂起，把结果（promsie）传给 handle，接着在执行 interatorValue.then()，将异步请求的值传给 interator.next()， 再次执行生成器。最后当（iteratorResult.done）为true时，退出。

await 的用法 大概分为三种:

- await + async
- await + Promise
- await + co + generaor

```js
//这是await 和 promsie 结合
function get1(){
  return 1
}
function get2(){
  return 2
}
function get3(){
  return 3
}
function get4(){
  return 4
}


(async function async(){
//   try{
//   } catch(err){
//     console.log('err: ', err);
//   }
  const g1 =  get1();
  const g2 =  get2();
  const g3 =  get3();
  const g4 =  get4();
  let sum  =0;
  let data = await Promise.all([g1,g2,g3,g4])
  for(v of data){
    sum = sum+v;
  }
  console.log(sum)
})()
```

## 后记

## 相关知识参考资料

[Promises/A+规范-英文](https://promisesaplus.com/)
  
[Promises/A+规范-翻译1](https://segmentfault.com/a/1190000002452115)

[Promises/A+规范-翻译-推荐](http://www.ituring.com.cn/article/66566)
  
[JS执行栈](https://malcolmyu.github.io/2015/06/12/Promises-A-Plus/#note-4)

[Javascript异步编程的4种方法](http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html)
