# batchedUpdate

```js
// 1 unit of expiration time represents 10ms.
export function msToExpirationTime(ms: number): ExpirationTime {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0);
}
```

  得出一个时间进行批量更新

```js
 this.setState({
   count: 1
 })
 console.log(this.state.count)
 this.setState({
   count: 1
 })
 console.log(this.state.count)

```

setState 没有进入 batchedUpdate


```js
try{
  return fn(a)
} finally{
  isBatchingUpdates = previousIsBatchingUpdates;

  // 当我们的setState 都调用完毕后，isBatchingUpdates 会变成false。 调用performSyncWork
  if(!isBatchingUpdates && !isRendering){
    performSyncWork();
  }
}
```

```js
setTimeout(()=>{
  this.setState({
    count: 1
  })
}, 0)

```

如果我们放在 setTimeout 里面，setTimeout的执行上下文变为window isBatchingUpdates 每次都会为 恢复原样的情况， 但是这样会变得应用性能很低

setState 本身的方法是同步的，但是调用后不代表立马就更新了,这个更新是根据我们当前的执行上下文来判断的, 如果出于批量更新的话，就不会更新

状态更新和执行回调的步骤是不一样的，更新状态在渲染阶段，而调用回调是在提交阶段，所以肯定是批量更新之后在一起回调的。

被打断的任务会回溯到最初的状态重新执行新的任务

FiberRoot 是只有一个的，也就是你的 container 对应的 fiber 对象

reactScheduler

* 维护时间片

* 模拟requestIdleCallback

* 调度列表

```js
function scheduleCallbackWithExpirationTime(
  root: FiberRoot,
  expirationTime: ExpirationTime,
) {
  if (callbackExpirationTime !== NoWork) {
    // A callback is already scheduled. Check its expiration time (timeout).
    if (expirationTime < callbackExpirationTime) {
      // Existing callback has sufficient timeout. Exit.
      return;
    } else {
      if (callbackID !== null) {
        // Existing callback has insufficient timeout. Cancel and schedule a
        // new one.
        cancelDeferredCallback(callbackID);
      }
    }
    // The request callback timer is already running. Don't start a new one.
  } else {
    startRequestCallbackTimer();
  }

  callbackExpirationTime = expirationTime;
  const currentMs = now() - originalStartTimeMs;
  const expirationTimeMs = expirationTimeToMs(expirationTime);
  const timeout = expirationTimeMs - currentMs;
  callbackID = scheduleDeferredCallback(performAsyncWork, {timeout});
}
```


```js
export {
  unstable_now as now,
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_shouldYield as shouldYield,
  unstable_cancelCallback as cancelDeferredCallback,
} from 'scheduler';

// 先导入进来， 在替换名字
```

异步任务是会交给 scheduler 来做，而这个 callback 就是交给 scheduler 的回调，回调里面其实就是 work 本身.

在组件中调用setState， react 都会将这个组件标记为dirty。 再一次事件循环结束后，Reat回走所所有被标记为dirty 的组件，并对它们重新渲染。




