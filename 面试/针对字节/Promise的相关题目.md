```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
setTimeout(function () {
  console.log("setTimeout");
}, 0);
async1();
new Promise(function (resolve) {
  console.log("promise1");
  resolve();
  console.log("promise2");
}).then(function () {
  console.log("promise3");
});
console.log("script end");

// --- script start
// --- script end
// --- async1 start
// --- Promise1
// --- Promise2
// --- async2
// --- async1 end
// --- promise3
// --- setTimeout
```

--不对

```js
async function async1() {
  console.log("async1_start_2");
  await async2();
  console.log("async1_end_6");
  return "async_return_8";
}

async function async2() {
  console.log("async2_3");
}

console.log("script_start_1");

setTimeout(function () {
  console.log("setTimeout_9");
}, 0);

async1().then(function (message) {
  console.log(message);
});

new Promise(function (resolve) {
  console.log("promise_4");
  resolve();
}).then(function () {
  console.log("promise_7");
});

console.log("script_end_5");
```

![](./0081Kckwgy1gl748f7tvcj30zq0dyq37.webp)

我们在做的时候 写出我们的任务队列

宏任务队列： setTimeout
微任务队列：none

async1 开始执行，当函数里遇到 await 时，暂停执行（await 所在行放在本次执行完），而 async1 函数 未完成部分被添加到宏任务队列

宏任务队列：async1 setTimeout
微任务队列：none

new Promise() 实例对象被 new 出来后，它里面的 promise1 会立刻打印，然后又遇到 then, 此时 promise 实例 被添加到微任务队列；

宏任务队列：async1 setTimeout
微任务队列：promise 实例

由于异步代码第一次执行时，async1 函数 要早于 promise 对象，所以紧接着 async1 函数继续执行没有执行完成的部分（例三中 promise.then 先于 await，所以 then 先执行），执行完毕后，退出任务队列，打印：async1 end。然后把它的 then 逻辑添加到任务微任务队列中;

​ 此时的任务队列：

宏任务队列：setTimeout

微任务队列：promise 实例 ，async1 的 then 逻辑部分

先清空微任务队列，promise 实例 继续执行它的 then 的逻辑，打印：promise2。执行完毕后，退出微任务队列；

​ 此时的任务队列：

宏任务队列：setTimeout

微任务队列：async1 的 then 逻辑部分

async 函数执行 then 逻辑；

此时的任务队列：

宏任务队列：setTimeout

微任务队列：none

setTimeout 是宏任务会在最后执行。

await 后面的代码虽然算作宏任务，但是和普通的微任务不在一个维度，位于更上一层的任务队列，所以优先度要比其他（下层）微任务要高；

定时器为什么是不精确的
因为定时器是异步的，要等到同步任务执行完之后，才会去执行异步的任务，即使 setTimeout(0)中时间为 0 也不是立马执行。再者 w3c 在 HTML 标准中规定，要求 setTimeout 时间低于 4ms 的都按 4ms 来算。

解决方法： 使用 web Worker 将定时函数作为独立线程执行

```js
new Promise((resolve, reject) => {
  resolve("success");
  console.log("new Promise");
});
console.log("finished");
```

构造函数内部的代码是立即执行的,then 是异步的

```js
Promise.resolve(1)
  .then((res) => {
    console.log(res); // => 1
    return 2; // 包装成 Promise.resolve(2)
  })
  .then((res) => {
    console.log(res); // => 2
  });
```

Promise 实现了链式调用，也就是说每次调用 then 之后返回的都是一个 Promise，并且是一个全新的 Promise，原因也是因为状态不可变。如果你在 then 中 使用了 return，那么 return 的值会被 Promise.resolve()包装

Promise 构造函数是同步，then 是异步

Promise 构造函数中是立即执行（同步任务），then 函数分发到微任务 Event Queue（异步任务），setTimeout 是分发到宏任务中

实现 promise

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending"; // pending, fulfilled, rejected
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.isCancelled = false; // 新增：取消标记

    // 保存 resolve 和 reject 的引用，以便在取消时调用
    const resolve = (value) => this.resolve(value);
    const reject = (reason) => this.reject(reason);

    // 提供取消方法给 executor
    const cancel = () => this.cancel();

    try {
      executor(resolve, reject, cancel);
    } catch (error) {
      reject(error);
    }
  }

  resolve(value) {
    if (this.state === "pending" && !this.isCancelled) {
      this.state = "fulfilled";
      this.value = value;
      setTimeout(() => {
        if (!this.isCancelled) {
          this.onFulfilledCallbacks.forEach((callback) => callback(value));
        }
      }, 0);
    }
  }

  reject(reason) {
    if (this.state === "pending" && !this.isCancelled) {
      this.state = "rejected";
      this.reason = reason;
      setTimeout(() => {
        if (!this.isCancelled) {
          this.onRejectedCallbacks.forEach((callback) => callback(reason));
        }
      }, 0);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const fulfilledHandler = () => {
        if (this.isCancelled) return; // 如果已取消，不执行
        try {
          if (typeof onFulfilled !== "function") {
            resolve(this.value);
          } else {
            const result = onFulfilled(this.value);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          }
        } catch (error) {
          reject(error);
        }
      };

      const rejectedHandler = () => {
        if (this.isCancelled) return; // 如果已取消，不执行
        try {
          if (typeof onRejected !== "function") {
            reject(this.reason);
          } else {
            const result = onRejected(this.reason);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === "fulfilled") {
        setTimeout(fulfilledHandler, 0);
      } else if (this.state === "rejected") {
        setTimeout(rejectedHandler, 0);
      } else if (this.state === "pending") {
        this.onFulfilledCallbacks.push(fulfilledHandler);
        this.onRejectedCallbacks.push(rejectedHandler);
      }
    });
  }

  // 新增：取消方法
  cancel() {
    if (this.state === "pending") {
      this.isCancelled = true;
      this.onFulfilledCallbacks = []; // 清空回调
      this.onRejectedCallbacks = [];
      this.state = "cancelled"; // 可选：标记为已取消状态
    }
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let completedCount = 0;
      const total = promises.length;

      if (total === 0) {
        resolve(results);
        return;
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          (value) => {
            results[index] = value;
            completedCount++;
            if (completedCount === total) {
              resolve(results);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) return;

      promises.forEach((promise) => {
        MyPromise.resolve(promise).then(
          (value) => resolve(value),
          (reason) => reject(reason)
        );
      });
    });
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }

  // 新增：创建可取消的 Promise
  static cancellable(executor) {
    let cancelFn;
    const promise = new MyPromise((resolve, reject, cancel) => {
      cancelFn = cancel; // 保存取消函数
      executor(resolve, reject, cancel);
    });
    return {
      promise,
      cancel: () => cancelFn(),
    };
  }
}

// 测试可取消 Promise
const { promise, cancel } = MyPromise.cancellable((resolve, reject) => {
  console.log("开始执行");
  const timeout = setTimeout(() => {
    resolve("成功");
  }, 2000);

  // 在取消时清理资源
  return () => clearTimeout(timeout);
});

promise.then(
  (value) => console.log("结果:", value), // 如果未取消，输出 "结果: 成功"
  (reason) => console.log("失败:", reason)
);

setTimeout(() => {
  cancel(); // 500ms 后取消
  console.log("已取消");
}, 500);
```
