# vue 源码分析



## 

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