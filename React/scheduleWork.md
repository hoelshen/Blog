
# scheduleWork

找到更新对应的fibrerRoot 节点
如果符合条件重置stack

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gj242yk65tj31120sata4.jpg)

我们每次更新都是从 rootfiber 开始，调用也是从其开始调用

```js
  if (
   1 expirationTime !== nextRenderExpirationTime ||
   2 root !== nextRoot ||
   3 nextUnitOfWork === null
  ) {
    // Reset the stack and start working from the root.
    resetStack();
    }

```

1. 相同的root 但是任务有不同优先级的任务要渲染
2. 新的root 要渲染
3. 或者在老的任务上没有下一个节点需要渲染了

可以优先打断老的应用
```js

function resetStack() {
  if (nextUnitOfWork !== null) {
    let interruptedWork = nextUnitOfWork.return;
    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }
  //  向上去去需找被打断的任务
  if (__DEV__) {
    ReactStrictModeWarnings.discardPendingWarnings();
    checkThatStackIsEmpty();
  }

  nextRoot = null;
  nextRenderExpirationTime = NoWork;
  nextLatestAbsoluteTimeoutMs = -1;
  nextRenderDidError = false;
  nextUnitOfWork = null;
}

```

requestWork 处于 ConcurrentMode 下的子树的渲染就是异步. 加入到 root 调度队列. 判断是否批量更新, 根据 expirationTime 判断调度类型

```js
  // Check if this root is already part of the schedule.
  if (root.nextScheduledRoot === null) {
    // This root is not already scheduled. Add it.
    root.expirationTime = expirationTime;
    if (lastScheduledRoot === null) {
      firstScheduledRoot = lastScheduledRoot = root;
      root.nextScheduledRoot = root;
    } else {
      lastScheduledRoot.nextScheduledRoot = root;
      lastScheduledRoot = root;
      lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
    }

    // 单向链表插入
  }

  if (expirationTime === Sync) {
    performSyncWork();
  } else {
    scheduleCallbackWithExpirationTime(root, expirationTime);  //deadline 执行不太重要的  在执行前 交由浏览器
  }
```

```js
var requestAnimationFrameWithTimeout = function(callback) {
  // schedule rAF and also a setTimeout
  rAFID = localRequestAnimationFrame(function(timestamp) {
    // cancel the setTimeout
    localClearTimeout(rAFTimeoutID);
    callback(timestamp);
  });
  rAFTimeoutID = localSetTimeout(function() {
    // cancel the requestAnimationFrame
    localCancelAnimationFrame(rAFID);
    callback(getCurrentTime());
  }, ANIMATION_FRAME_TIMEOUT);
};
  //我们设置了个timeout , 如果localRequestAnimationFrame 在100ms没有被调用

```

performWork

是否有deadline 的区分

超过时间片的处理
```js
    while (
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      (minExpirationTime === NoWork ||
        minExpirationTime >= nextFlushedExpirationTime) &&
      (!deadlineDidExpire || currentRendererTime >= nextFlushedExpirationTime)
    ) {
      performWorkOnRoot(
        nextFlushedRoot,
        nextFlushedExpirationTime,
        currentRendererTime >= nextFlushedExpirationTime,
      );
      findHighestPriorityRoot();
      recomputeCurrentRendererTime();
      currentSchedulerTime = currentRendererTime;
    }

```
while 判断 expiration 调度


renderRoot过程
调用 workLoop 进行循环单元更新, 将整棵fiberroot 进行更新
捕获错误并进行处理

```js
function renderRoot(
  root: FiberRoot,
  isYieldy: boolean,
  isExpired: boolean,
){
  do {
    try {
      workLoop(isYieldy);
    }
}


function workLoop(isYieldy) {
  if (!isYieldy) {
    // Flush work without yielding
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  } else {
    // Flush asynchronous work until the deadline runs out of time.
    while (nextUnitOfWork !== null && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  }
}


```

```js
 next = beginWork(current, workInProgress, nextRenderExpirationTime);
```