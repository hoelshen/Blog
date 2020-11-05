# vue 源码分析



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