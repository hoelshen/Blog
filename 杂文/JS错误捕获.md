# 错误监控

## 异常处理

JavaScript 引擎首先会读取代码，然后运行它。在读取阶段发生的错误被称为“解析时间（parse-time）”错误，并且无法恢复（从该代码内部）。这是因为引擎无法理解该代码。

所以，try..catch 只能处理有效代码中出现的错误。这类错误被称为“运行时的错误（runtime errors）”，有时被称为“异常（exceptions）”。

```js
try {
  setTimeout(function() {
    noSuchVariable; // 脚本将在这里停止运行
  }, 1000);
} catch (e) {
  alert( "won't work" );
}
```

```js
window.onerror = function (msg, url, row, col, error) {
  console.log('🌸', msg)  //能捕获到异步错误
  return true
}
```


```js
window.addEventListener('error', msg, url, row, col, error) {
  console.log('🌸', msg)  //能捕获到异步错误
  return true
}, true)

```


```js
// 捕获全局 promise 错误
window.addEventListener('unhandlerejection', function(e){
  e.preventDefault();
  console.log(e.reason)
  // 消化错误， 则需要显示返回true
  return true
})


new Promise((resolve, reject) => {
  reject('第一个 error')
})

Promise.reject('第二个错误')
```

Fundebug 的操作
记录错误
1. 用户 xpath 用户操作栈
2. 服务端 xpath mp4=> gif
3. socket 图片 html2canvas
4. session statck
5. 容错 数据的时候 ajax navigator.sendBeacon('xx.php')