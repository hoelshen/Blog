```JS
//JavaScript
requestIdleCallback(myWork);
// 一个任务队列
let tasks = [
  function t1() {
    console.log("执行任务1");
  },
  function t2() {
    console.log("执行任务2");
  },
];
// deadline是requestIdleCallback返回的一个对象
function myWork(deadline) {
  console.log(`当前帧剩余时间: ${deadline.timeRemaining()}`);
  // 方法timeRemaining返回的是当前帧的剩余时间
  if (deadline.timeRemaining() > 0 && tasks.length) {
    // 可以在这里做一些事情了
    const task = tasks.shift();
    task();
  }
  // 如果还有任务没有被执行，那就放到下一帧调度中去继续执行，类似递归
  if (tasks.length) {
    requestIdleCallback(myWork);
  }
}

```

// ## requestAnimationFrame 帮我们计算出当前帧的剩余时间 然后调用myWork

1. requestAnimationFrame回调是由系统决定何时调用，而且是在每次绘制之前调用
1. 一般情况系统绘制频率是60HZ，那么回调就是1000/60=16.67ms被执行一次，这样保证每次16.66ms调用一次执行这个回调，就不会出现丢帧导致卡顿的问题

我们来看下MDN对这个API的介绍：
window.requestAnimationFrame(callback);

参数
callback
下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)。该回调函数会被传入DOMHighResTimeStamp参数，该参数与performance.now()的返回值相同，它表示requestAnimationFrame() 开始去执行回调函数的时刻。
返回值
一个 long 整数，请求 ID ，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给 window.cancelAnimationFrame() 以取消回调函数。

实现一个requestIdelCallback需要知道deadline.timeRemaining()当前帧剩余时间的计算。

1. 当前帧结束时间
  requestAnimationFrame的回调被执行的时机是当前帧开始绘制之前。也就是说rafTime是当前帧开始绘制的时间
  frameDeadline = rafTime + 16.67ms
2. 当前帧剩余时间
  当前帧剩余时间 = 当前帧结束时间 - 当前帧花费时间
  需要知道『当前帧花费的时间』

  我们来看下react中是怎么实现MessageChannel的代码：

  ```javascript
  let frameDeadline // 当前帧的结束时间
  let penddingCallback // requestIdleCallback的回调方法
  let channel = new MessageChannel()
  
  // 当执行此方法时，说明requestAnimationFrame的回调已经执行完毕，此时就能算出当前帧的剩余时间了，直接调用timeRemaining()即可。
  // 因为MessageChannel是宏任务，需要等主线程任务执行完后才会执行。我们可以理解requestAnimationFrame的回调执行是在当前的主线程中，只有回调执行完毕onmessage这个方法才会执行。
  // 这里可以根据setTimeout思考一下，setTimeout也是需要等主线程任务执行完毕后才会执行。
  channel.port2.onmessage = function() {
    // 判断当前帧是否结束
    // timeRemaining()计算的是当前帧的剩余时间 如果大于0 说明当前帧还有剩余时间
    let timeRema = timeRemaining()
    if(timeRema > 0){
        // 执行回调并把参数传给回调
      penddingCallback && penddingCallback({
            // 当前帧是否完成
            didTimeout: timeRema < 0,
            // 计算剩余时间的方法
        timeRemaining
      })
    }
  }
  // 计算当前帧的剩余时间
  function timeRemaining() {
      // 当前帧结束时间 - 当前时间
    // 如果结果 > 0 说明当前帧还有剩余时间
    return frameDeadline - performance.now()
  }
  window.requestIdleCallback = function(callback) {
    requestAnimationFrame(rafTime => {
        // 算出当前帧的结束时间 这里就先按照16.66ms一帧来计算
        frameDeadline = rafTime + 16.66
        // 存储回调
        penddingCallback = callback
        // 这里发送消息，MessageChannel是一个宏任务，也就是说上面onmessage方法会在当前帧执行完成后才执行
        // 这样就可以计算出当前帧的剩余时间了
        channel.port1.postMessage('haha') // 发送内容随便写了
    })
  }
  

  ```

```JS
let frameDeadline // 当前帧的结束时间
let penddingCallback // requestIdleCallback的回调方法
let channel = new MessageChannel()

// 当执行此方法时，说明requestAnimationFrame的回调已经执行完毕，此时就能算出当前帧的剩余时间了，直接调用timeRemaining()即可。
// 因为MessageChannel是宏任务，需要等主线程任务执行完后才会执行。我们可以理解requestAnimationFrame的回调执行是在当前的主线程中，只有回调执行完毕onmessage这个方法才会执行。
// 这里可以根据setTimeout思考一下，setTimeout也是需要等主线程任务执行完毕后才会执行。
channel.port2.onmessage = function() {
  // 判断当前帧是否结束
  // timeRemaining()计算的是当前帧的剩余时间 如果大于0 说明当前帧还有剩余时间
  let timeRema = timeRemaining()
	if(timeRema > 0){
    	// 执行回调并把参数传给回调
		penddingCallback && penddingCallback({
      		// 当前帧是否完成
      		didTimeout: timeRema < 0,
      		// 计算剩余时间的方法
			timeRemaining
		})
	}
}
// 计算当前帧的剩余时间
function timeRemaining() {
    // 当前帧结束时间 - 当前时间
	// 如果结果 > 0 说明当前帧还有剩余时间
	return frameDeadline - performance.now()
}
window.requestIdleCallback = function(callback) {
	requestAnimationFrame(rafTime => {
      // 算出当前帧的结束时间 这里就先按照16.66ms一帧来计算
      frameDeadline = rafTime + 16.66
      // 存储回调
      penddingCallback = callback
      // 这里发送消息，MessageChannel是一个宏任务，也就是说上面onmessage方法会在当前帧执行完成后才执行
      // 这样就可以计算出当前帧的剩余时间了
      channel.port1.postMessage('haha') // 发送内容随便写了
	})
}

```
