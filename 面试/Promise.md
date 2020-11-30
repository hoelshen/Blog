

```js
async function async1() {
    console.log("async1_start_2");
    await async2();
    console.log("async1_end_6");
    return 'async_return_8';
}
 
async function async2() {
    console.log("async2_3");
}
 
console.log("script_start_1");
 
setTimeout(function() {
    console.log("setTimeout_9");
}, 0);
 
async1().then(function (message) { console.log(message) });
 
new Promise(function(resolve) {
    console.log("promise_4");
    resolve();
}).then(function() {
    console.log("promise_7");
});
 
console.log("script_end_5");

```

![](https://tva1.sinaimg.cn/large/0081Kckwgy1gl748f7tvcj30zq0dyq37.jpg)

我们在做的时候 写出我们的任务队列

宏任务队列： setTimeout
微任务队列：none

async1 开始执行，当函数里遇到await时，暂停执行（await所在行放在本次执行完），而 async1 函数 未完成部分被添加到宏任务队列

宏任务队列：async1 setTimeout
微任务队列：none

new Promise() 实例对象被new出来后，它里面的promise1会立刻打印，然后又遇到 then, 此时 promise 实例 被添加到微任务队列；

宏任务队列：async1 setTimeout
微任务队列：promise 实例


由于异步代码第一次执行时，async1 函数 要早于 promise对象，所以紧接着 async1 函数继续执行没有执行完成的部分（例三中promise.then先于await，所以then先执行），执行完毕后，退出任务队列，打印：async1 end。然后把它的 then 逻辑添加到任务微任务队列中;

​此时的任务队列：

宏任务队列：setTimeout

微任务队列：promise实例 ，async1的then逻辑部分

先清空微任务队列，promise 实例 继续执行它的 then 的逻辑，打印：promise2。执行完毕后，退出微任务队列；

​ 此时的任务队列：

宏任务队列：setTimeout

微任务队列：async1的then逻辑部分

async 函数执行 then 逻辑；

此时的任务队列：

宏任务队列：setTimeout

微任务队列：none

setTimeout是宏任务会在最后执行。

await后面的代码虽然算作宏任务，但是和普通的微任务不在一个维度，位于更上一层的任务队列，所以优先度要比其他（下层）微任务要高；

定时器为什么是不精确的
因为定时器是异步的，要等到同步任务执行完之后，才会去执行异步的任务，即使setTimeout(0)中时间为0也不是立马执行。再者w3c在HTML标准中规定，要求setTimeout时间低于4ms的都按4ms来算。

解决方法： 使用 web Worker 将定时函数作为独立线程执行


```js
new Promise((resolve, reject) => {
resolve('success')
console.log('new Promise')
})
console.log('finifsh')
```

构造函数内部的代码是立即执行的,then是异步的

```js
Promise.resolve(1)
  .then(res => {
    console.log(res) // => 1
    return 2 // 包装成 Promise.resolve(2)
  })
  .then(res => {
    console.log(res) // => 2
  })
```

Promise实现了链式调用，也就是说每次调用then之后返回的都是一个Promise，并且是一个全新的Promise，原因也是因为状态不可变。如果你在then中 使用了return，那么return的值会被Promise.resolve()包装

Promise构造函数是同步，then是异步

Promise构造函数中是立即执行（同步任务），then函数分发到微任务Event Queue（异步任务），setTimeout是分发到宏任务中