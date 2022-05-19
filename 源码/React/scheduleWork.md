
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

在 render 阶段:
  在 render 阶段, react 将更新应用于通过 setState 或 render 方法触发的组件, 并确定需要在用户屏幕上做哪些更新 -- 哪些节点需要插入, 更新或删除, 哪些组件需要调用其生命周期方法. 最终的这些更新信息被保存在一个叫 effect list 的 fiber 节点树上( 关于 fiber 的内容, 在这篇文章中简述 react 中的 fiber). 当然, 在首次渲染时, React 不需要产生任何更新信息，而是会给每个从 render 方法返回的 element 生成一个 fiber 节点，最终生成一个 fiber 节点树， 后续的更新也是复用了这棵fiber树。

在上图中， render 阶段被标记为纯的、没有副作用的，可能会被 React 暂停、终止或者重新执行。也就是说，React 会根据产生的任务的优先级，安排任务的调度（schedule）。利用类似 requestIdleCallback 的原理在浏览器空闲阶段进行更新计算，而不会阻塞动画，事件等的执行。

在 commit 阶段:  react 内部会有三个 fiber 树

```js
current fiber tree: 在首次渲染时, react 不需要产生任何更新信息, 而是会给每个从 render 方法返回的 element 生成一个 fiber 节点,后续的更新也是复用了这颗 fiber 树.

workInProgress fiber tree:  所有的更新计算工作都在 workInProgress tree 的 fiber 上执行. 当 react 遍历 current fiber tree 时, 它为每个 current fiber 创建一个替代 (alternate) 节点, 这样的 alternate 节点构成了 workInProgress tree.

effect list fiber tree: workInprogress fiber tree 的子树, 这个树的作用串联了标记具有更新的节点.
```

commit阶段会遍历effect list，把所有更新都commit到DOM树上。具体的，首先会有一个**pre-commit**阶段，主要是执行**getSnapshotBeforeUpdate**方法，可以获取当前DOM的快照（snap）。然后给需要卸载的组件执行**componentWillUnmount**方法。接着会把**current fiber tree**替换为**workInProgress fiber tree**。最后执行DOM的插入、更新和删除，给更新的组件执行componentDidUpdate，给插入的组件执行componentDidMount。

重点要注意的是，这一阶段是同步执行的，不能中止。

# ReactNative用法

其中16.3版本和16.4版本的生命周期稍有不同，首先我们一起来16.4版本的流程图

1.React 16.4版本中getDerivedStateFromProps()在父组件更新接受props,组件自身调用setState()函数以及forceUpdate()函数执行时都会被触发
2.React 16.3在更新阶段只有父组件更新才会触发。

## 初始化

## 挂载

## 卸载
