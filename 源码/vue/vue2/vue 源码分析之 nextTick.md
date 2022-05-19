# vue 源码分析

## 为什么要异步更新

setter -> Dep -> Watcher -> patch -> 视图

Vue.js在默认情况下，每次触发某个数据的 setter 方法后，对应的 Watcher 对象其实会被 push 进一个队列 queue 中，在下一个 tick 的时候将这个队列 queue 全部拿出来 run（ Watcher 对象的一个方法，用来触发 patch 操作） 一遍。

虽然知道要通过异步来解决，但具体是如何解决的呢？Vue的做法是把调用cb放到了一个micro task或者macro task队列中，具体放到微任务队列还是宏任务队列要看当前的运行环境是否支持Promise、MutationObserver、setImmediate这几个相当于放入微任务队列的api，支持就会放在微任务队列，不支持则使用setTimeout这个api把调用cb放到宏任务队列里。

不管放到微任务队列还是宏任务队列，调用cb都会在所有的同步代码执行完毕后执行。这一点涉及到event loop的知识，因为总是先执行所有的同步代码，然后从微任务队列中按顺序执行，微任务队列空了才会从宏任务队列中取出一条执行。如果此时微任务队列还有任务，那么就会继续按照这个循环执行，这个就是event loop。

# vue 源码分析

Vue.js 实现了一个 nextTick 函数，传入一个 cb ，这个 cb 会被存储到一个队列中，在下一个 tick 时触发队列中的所有 cb 事件。

因为目前浏览器平台并没有实现 nextTick 方法，所以 Vue.js 源码中分别用 Promise、setTimeout、setImmediate 等方式在 microtask（或是task）中创建一个事件，目的是在当前调用栈执行完毕以后（不一定立即）才会去执行这个事件。

首先定义一个 callbacks 数组用来存储 nextTick，在下一个 tick 处理这些回调函数之前，所有的 cb 都会被存在这个 callbacks 数组中。pending 是一个标记位，代表一个等待的状态。

setTimeout 会在 task 中创建一个事件 flushCallbacks ，flushCallbacks 则会在执行时将 callbacks 中的所有 cb 依次执行。

```js
let callbacks = [];
let pending = false;

function nextTick (cb) {
    callbacks.push(cb);

    if (!pending) {
        pending = true;
        setTimeout(flushCallbacks, 0);
    }
}

function flushCallbacks () {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}
```

在执行时 watcher 也要发生变化，同一个watcher 在同一个tick 的时候应该只被执行一次， 也就是说队列queue 中不应该出现重复的watcher 对象。

实现 update 方法，在修改数据后由 Dep 来调用， 而 run 方法才是真正的触发 patch 更新视图的方法。

```js
let uid = 0;

class Watcher {
    constructor () {
        this.id = ++uid;
    }

    update () {
        console.log('watch' + this.id + ' update');
        queueWatcher(this);
    }

    run () {
        console.log('watch' + this.id + '视图更新啦～');
    }
}
```

queueWatcher

将 Watcher 对象自身传递给 queueWatcher 方法。

```js
let has = {};
let queue = [];
let waiting = false;

function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] == null) {
        has[id] = true;
        queue.push(watcher);

        if (!waiting) {
            waiting = true;
            nextTick(flushSchedulerQueue);
        }
    }
}
```

我们使用一个叫做 has 的 map，里面存放 id -> true ( false ) 的形式，用来判断是否已经存在相同的 Watcher 对象 （这样比每次都去遍历 queue 效率上会高很多）。

如果目前队列 queue 中还没有这个 Watcher 对象，则该对象会被 push 进队列 queue 中去。

waiting 是一个标记位，标记是否已经向 nextTick 传递了 flushSchedulerQueue 方法，在下一个 tick 的时候执行 flushSchedulerQueue 方法来 flush 队列 queue，执行它里面的所有 Watcher 对象的 run 方法。

```js
function flushSchedulerQueue () {
    let watcher, id;

    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        id = watcher.id;
        has[id] = null;
        watcher.run();
    }

    waiting  = false;
}
```

## nextTick

```js
// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
// 如果浏览器不支持Promise，使用宏任务来执行nextTick回调函数队列
// 能力检测，测试浏览器是否支持原生的setImmediate（setImmediate只在IE中有效）
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // 如果支持，宏任务（ macro task）使用setImmediate
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
  // 同上
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  // 都不支持的情况下，使用setTimeout
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}




```

1. nextTick 函数设计的目的是让所有通过 nextTick 执行的函数 cb 异步执行，也就是在下一个 tick 执行。
2. 调用 nextTick 的 cb 不会立马执行，会收集到一个 callbacks 数组中
3. macroTimerFunc 或者 microTimerFunc 就是在下一个 tick 去遍历 callbacks 数组执行。
4. 显然，在一个同步 tick 内，即使 nextTick 函数被多次执行，但是 macroTimerFunc 或者 microTimerFunc 并不需要多次执行，所以需要一个 pending 标志位来保证他们只执行一次。
5. 当 callbacks 数组在下一个 tick 执行后，需要重置 pending，保证之后执行 nextTick 的逻辑正确。
