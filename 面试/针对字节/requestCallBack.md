聊聊 requestIdleCallback 接口
解题：
● 初阶：
○ 是什么：用于在浏览器空闲时间执行回调代码的接口
○ 怎么做：

```js
function work(deadline) {
  console.log(`当前帧剩余时间: ${deadline.timeRemaining()}`);
  if (deadline.timeRemaining() > 1 || deadline.didTimeout) {
    // 走到这里，说明时间有余，我们就可以在这里写自己的代码逻辑
  }
  // 走到这里，说明时间不够了，就让出控制权给主线程，下次空闲时继续调用
  requestIdleCallback(work);
}
requestIdleCallback(work, { timeout: 1000 });
```

    ■ 注册回调
    ■ 回调中关注 deadline.timeRemaining，尽可能保证回调执行时间小于这个 dl

○ 为什么：可以让我们在不妨碍页面响应的情况下，执行一些代码操作
○ 应用场景：例如 react concurrent 模式就强依赖于该 api 实现时间分片调度
● 中阶：
○ 如何计算空闲时间
■ 浏览器一帧的事件为 16ms
■ 浏览器一帧中需要做很多事情：

      ● input 事件处理
      ● js 定时器、宏/微任务等
      ● resize、scroll 等事件处理
      ● rAF 回调
      ● 布局
      ● 绘制
    ■ 假如在 16ms 内完成上述事项，还有剩余时间，则进入 idle 状态，调用 ric

    ■ 第二种情况：长时间没有操作时

      ● 理论上到下一次动作之前都属于 idle 时间，但浏览器会将 deadline 设定为 50ms，以免过长的任务影响响应速度
      ● 所以，deadline < 50ms

    ○ 适用场景：适合做一些低优的、可拆分的任务
    ■ 数据上报
    ■ 数据同步、分析等
    ■ 检测卡顿
    ■ react 的 scheduler 调度器
    ■ qiankun 源码中的预加载
    ○ 问题：
    ■ 尽量避免在 rIC 中调用 dom 接口
    ● dom 操作可能导致重排重绘，时间不可控，可能会超出 deadline 定义的时间长度，因此不应该在 rIC 操作，可使用 rAF 代替
    ■ 避免使用 promise
    ● promise 优先级很高，会在 idle 后立即执行，可能影响下一帧时间
    ■ 兼容性差，至今依然处于实验阶段
    ● 使用 setTimeout 代替

```js
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    var start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };
```

requestAnimationFrame  
专为动画设计，确保任务在浏览器下一次重绘前执行，与显示器刷新率同步（通常 60Hz，即每帧约 16.7ms）。

典型场景：实现平滑的动画效果，例如更新元素位置、绘制 Canvas 或 WebGL 内容。

示例：

```javascript
function animate(timestamp) {
  // 更新动画
  element.style.transform = `translateX(${
    Math.sin(timestamp * 0.001) * 100
  }px)`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

requestIdleCallback  
旨在利用浏览器空闲时间执行非紧急任务，避免干扰用户交互或动画。

典型场景：批量处理数据、预加载资源、发送分析日志等。

示例：

```javascript
function processData(deadline) {
  while (deadline.timeRemaining() > 0 && data.length > 0) {
    // 处理数据
    console.log(data.shift());
  }
  if (data.length > 0) {
    requestIdleCallback(processData);
  }
}
requestIdleCallback(processData);
```

调用时机
requestAnimationFrame  
在浏览器准备绘制下一帧时调用，通常与屏幕刷新同步，保证动画流畅。

如果主线程繁忙，可能略有延迟，但优先级较高。

requestIdleCallback  
在浏览器完成所有高优先级任务（如用户输入、动画、渲染）后，且有空闲时间时调用。

如果浏览器持续忙碌，任务可能被推迟，甚至在几秒后才执行。

requestAnimationFrame  
回调函数接收一个 timestamp 参数，表示回调执行时的精确时间（以毫秒为单位）。

示例：

```javascript
requestAnimationFrame((timestamp) => {
  console.log(`执行时间: ${timestamp}`);
});
```

requestIdleCallback  
回调函数接收一个 IdleDeadline 对象，提供 timeRemaining() 方法，用于检查当前帧剩余的空闲时间（单位：毫秒）。

示例：

```javascript
requestIdleCallback((deadline) => {
  console.log(`剩余时间: ${deadline.timeRemaining()}`);
});
```

时间控制
requestAnimationFrame  
没有直接的时间限制，但开发者通常需要自行确保回调逻辑在 16.7ms 内完成，以避免掉帧。

requestIdleCallback  
提供 timeout 选项，强制任务在指定时间后执行（即使没有空闲时间），但默认情况下依赖浏览器判断空闲时机。

示例：

```javascript
requestIdleCallback(myTask, { timeout: 2000 }); // 最多延迟 2 秒
```
