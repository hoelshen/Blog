# ES6之异步流程的前世今生（上）

  本文讲述了异步流程的演变过程。那么是什么是异步编程呢： 简单来讲就是执行一个指令不会马上返回结果而执行下一个任务，而是等到特定的事件触发后，才能得到结果。

## 基础知识

  我们知道 javascript 运行在浏览器中，以 Google 浏览器为例子，
    v8 引擎，包含 内存堆： 这是内存分配发生的地方。 调用栈： 这是你代码执行的地方。

    运行一个函数时，解析器把该函数添加到栈中并且执行这个函数。

    Web APIs: DOM、AJAX、Timeout(setTimeout)

    js是一门单线程的语言， 这意味这它只有一个调用栈。

    当我们堆栈执行的函数需要大量时间时，浏览器会停止响应，幸运的是我们有异步回调。

    javaScript引擎 运行在宿主环境中（浏览器或者 node），
    CallbackQueue  and Event Loop

    事件循环和回调队列
    调用栈和回调队列，当栈为空时，它会调取出队列中的第一个事件，放到调用栈中执行;
    
    常见的 宏任务(macro-task)（这个队列也被叫做 task queue） 比如： setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作、UI 渲染等。

    常见的 微任务(micro-task) 比如: process.nextTick、Promise、Object.observe、MutationObserver 等。

    promise 永远会在队列尾部添加微观任务

    为什么Promise的代码（microtask）会比setTimeout的代码（macrotask）更优先执行，因为它太机智了，竟然会插队！

## 常见的异步编程方案

  1. 回调函数
  2. 事件监听
  3. 发布/订阅
  4. promise对象

## 环境配置

  一双能敲代码的手、一台能执行代码的电脑。
需要预先引入的库

      const fs = require('fs')
      
      const co = require('co')
      
      const util = require('util')

## callback（）

第一阶段：回调函数

```javascript
function readFile(cb) {
    fs.readFile('./package.json', (err, data) => {
        if (err) return cb(err)
        cb(null, data)
    })
}

readFile((err, data) => {
    if (!err) {
        data = JSON.parse(data)
        console.log(data.name)
    }
})
```

  回调函数的弊端
  
  1. 代码书写顺序与执行顺序不一致，不利于维护
  2. 回调函数大多是匿名函数，bug 追踪困难
  3. 异步操作的代码变更，后期维护麻烦。

## 事件监听

  采用了事件驱动模型，任务的执行不取决与代码的顺序，取决于某个事件是否发生。
  
``` js
  function f1() {

    setTimeout(function() {

         // f1的任务代码

          f1.trigger('done');

      }, 1000);

  }
```

## 发布/订阅

  假定我们存在一个任务中心，当某个事件完成之后，我们就发射状态信号，调度中心可以通知订阅了该状态信号的其他任务。这个也称为观察者模式。

 ```js
  jQuery.subscribe("done", f2);

  function f1(){

  setTimeout(function () {

  // f1的任务代码

  jQuery.publish("done");

    }, 1000);

  }

  当f1 执行完成后， 向信号中心"jquery"发布"done"信号，从而引发f2的执行。


 ```

## promise

第二阶段：Promise

  定义阶段：promise（resolve， reject）分别成功或者失败时处理什么。
  
  调用阶段：通过then函数实现，成功就执行resolve，它会将reslove的值传递给最近的then函数，作为then函数的参数。如果出错reject，那么交给catch来捕获异常

  promise的要点如下：

  1. 递归： 每个一步操作返回的都是promise对象
  2. 状态机： 三种状态peomise对象内部可以控制，不能在外部改变状态
  3. 全局异常处理

将回调函数中的结果延后到 then 函数里处理或交给全局异常处理

我们约定将每个函数的返回值都得是 promise 对象。 只要是 promise 对象， 就可以控制状态并支持 then 方法，将无限个 promise 对象链接在一起。

```javascript
hello('xx.html').then(log).then(function() {
    return world('./xxx.js').then(log)
}).catch(err => {
    console.log(err)
})
```

每个 promise 对象都有 then 方法， 也就是说then方法是定义在原型对象promise.prototype上的， 它的作用是为
promise 实例添加状态改变时的回调函数

```js

Promise.prototype.then() = function (success, fail) {
  this.done(success)
  this.fail(fail)
  return this
}
```

一般情况下，只传 success 回调函数即可，fail函数可选，使用catch来捕获函数异常比通过fail函数进行处理更加可控。

``` javascript
const requireDirectory = require(require-directory )
module.export = requireDirectory(module)

function readFileAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

readFileAsync('./package.json')
    .then(data => {
        data = JSON.parse(data)
        console.log(data.name)
    })
    .catch(err => {
        console.log(err)
    })
```

  我们来看看下面这个例子：

```js
  new Promise(function (resolve) {
    resolve(1)
  }).then(function (value) {
    console.log(value)
  })



  Promise.resolve(1).then(function (value) {
    console.log(' Promise.resovle' + value)
  })

  var error = new Error('this is a error')

```

  new Promise更为强大,Promise.resolve更为便捷

以下是更为便捷的写法

```js
function hello(i){
  return Promise.resolve(i)
}
hello(1).then(function(){
  console.log('promise.reslove1=' + value)
})

// Promise.resolve返回的是prmise对象，相当于 new Promise(resolve,reject)实例

// Promise.prototype.then()方法的语法如下
p.then(onFulfilled,onRejected);
// p.then(function(value)){}

p.catch(onRejected)
// p.catch(function(reson)) {}


```

```js
//整个promise 还有这种写法
hell('./xx.json').then(function (data) {
  return new Promise(function (reslove, reject) {
    console.log('promise ' + data)
    reslove(data)
  })
}).then(function (data) {
  return new Promise(function (reslove, reject) {
    console.log('promise ' + data)
    reslove(data)
  })
}).then(function (data) {
  return new Promise(function (reslove, reject) {
    console.log('promise ' + data)
    reslove(data)
  })
}).catch(function (err) {
  console.log(err)
})

```

### promise原理

```js

const PENDING =  "pending"
const FULFILLED =  "fulfilled"
const REJECTED =  "rejected"

function MyPromise(executor){
  // executor：这是实例Promise对象时在构造器中传入的参数，一般是一个function(resolve,reject){}
  let that = this;
  this.status = PENDING;
  this.value = undefined;
  this.reason = undefined;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];


  function resolve(value){
    if(value instanceof Promise) {
        return value.then(resolve, reject);
    }
    // 要确保 onFulfilled 和 onRejected 方法异步执行
    setTimeout(() => {
        // 调用resolve 回调对应onFulfilled函数
        if (that.status === PENDING) {
            // 只能由pedning状态 => fulfilled状态 (避免调用多次resolve reject)
            that.status = FULFILLED;
            that.value = value;
            that.onFulfilledCallbacks.forEach(cb => cb(that.value));
        }
    });

  }
  function reject(reason){
    setTimeout(() => {
        // 调用reject 回调对应onRejected函数
        if (that.status === PENDING) {
            // 只能由pedning状态 => rejected状态 (避免调用多次resolve reject)
            that.status = REJECTED;
            that.reason = reason;
            that.onRejectedCallbacks.forEach(cb => cb(that.reason));
        }
    });
  }
  // executor方法可能会抛出异常，需要捕获
  try {
    executor(resolve, reject);
  } catch (e) {
      reject(e);
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  //获取下this
  let self = this;

  if(this.status === FULFILLED){
    onFulfilled(self.value)
  }

  if(this.status === REJECTED){
    onRejected(self.value)
  }
  //异步时处理
  if(this.status === PENDING){
    //保存回调函数
    this.onFulfilledCallbacks.push(()=>{
      onFulfilled(self.value)
    });

    this.onRejectedCallbacks.push(()=>{
      onRejected(self.reason)
    })
  }
};


var mp = new MyPromise((resolve, reject) => {
    console.log(11111);
    setTimeout(() => {
        resolve(22222);
        console.log(3333);
    }, 1000);
});
mp.then(x => {
    console.log(x);
    console.log('4444')
}, (err) => {
    console.log('err2', err);
})

```

  上述代码就是一个简单的promise了，但是还有两点问题没有解决1.链式调用  2.不传值时。
  我们改造下

```js

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  //获取下this
  let that = this;

  //链式调用 在创建一个promise
  let promsie2 = null;

  //解决onFulfilled、onRejected没有传值的问题
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : y => y
  onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}


    if (that.status === FULFILLED) { // 成功态
        return newPromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try{
                    let x = onFulfilled(that.value);
                    resolvePromise(newPromise, x, resolve, reject); // 新的promise resolve 上一个onFulfilled的返回值
                } catch(e) {
                    reject(e); // 捕获前面onFulfilled中抛出的异常 then(onFulfilled, onRejected);
                }
            });
        })
    }

    if (that.status === REJECTED) { // 失败态
        return newPromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(that.reason);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            });
        });
    }

    if (that.status === PENDING) { // 等待态
        // 将onFulfilled/onRejected收集暂存到集合中
        return newPromise = new MyPromise((resolve, reject) => {
            that.onFulfilledCallbacks.push((value) => {
                try {
                    let x = onFulfilled(value);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            });
            that.onRejectedCallbacks.push((reason) => {
                try {
                    let x = onRejected(reason);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            });
        });
    }

  })

};
```

resolvePromsie 是什么呢: Promise A+ 2.27规范

```js
/**
 * resolve中的值几种情况：
 * 1.普通值
 * 2.promise对象
 * 3.thenable对象/函数
 */

/**
 * 对resolve 进行改造增强 针对resolve中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {  // 如果从onFulfilled中返回的x 就是promise2 就会导致循环引用报错
        return reject(new TypeError('循环引用'));
    }

    let called = false; // 避免多次调用
    // 如果x是一个promise对象 （该判断和下面 判断是不是thenable对象重复 所以可有可无）
    if (x instanceof Promise) { // 获得它的终值 继续resolve
        if (x.status === PENDING) { // 如果为等待态需等待直至 x 被执行或拒绝 并解析y值
            x.then(y => {
                resolvePromise(promise2, y, resolve, reject);
            }, reason => {
                reject(reason);
            });
        } else { // 如果 x 已经处于执行态/拒绝态(值已经被解析为普通值)，用相同的值执行传递下去 promise
            x.then(resolve, reject);
        }
        // 如果 x 为对象或者函数
    } else if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
        try { // 是否是thenable对象（具有then方法的对象/函数）
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if(called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, reason => {
                    if(called) return;
                    called = true;
                    reject(reason);
                })
            } else { // 说明是一个普通对象/函数
                resolve(x);
            }
        } catch(e) {
            if(called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}
```

测试代码

```js
var p1 = new MyPromise(function (resolve) {
  setTimeout(function () {
    resolve(1);
  }, 1000);
})



p1.then(function (val) {
  console.log(val)
  var p3 = new MyPromise(function (resolve) {
    setTimeout(function () {
      resolve(val + 1);
    }, 1000);
  });
  return p3;
}).then(function (val) {
  console.log(val);
  var p4 = new MyPromise(function (resolve) {
    setTimeout(function () {
      resolve(val + 1);
    }, 1000);
  });
  return p4
}).then(function (val){
  console.log(val);
  var p4 = new MyPromise(function (resolve) {
    setTimeout(function () {
      resolve(val + 1);
    }, 1000);
  });
});

```

增加Promise.resolve、catch、race 方法

```js
// 用于promise方法链时 捕获前面onFulfilled/onRejected抛出的异常
MyPromise.catch = function(onRejected) {
  return this.then(null, onRejected);
}

MyPromise.resolve = function (value) {
  return new Promise(resolve => {
      resolve(value);
  });
}

MyPromise.race = function(promises) {
  return new Promise((resolve, reject) => {
      promises.forEach((promise, index) => {
         promise.then(resolve, reject);
      });
  });
}

MyPromise.allsettle = funciton() {
  return new Promsie(reslove, reject) =>{

  }
}
Promise.all() 和 Promise.race() 都具有 短路特性

Promise.all()： 如果参数中  promise 有一个失败（rejected），此实例回调失败（reject）

Promise.race()：如果参数中某个promise解决或拒绝，返回的 promise就会解决或拒绝。



```

```js
// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON('/post/' + id + ".json");
});

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
});

```
