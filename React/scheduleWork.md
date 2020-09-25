


找到更新对应的fibrerRoot 节点
如果符合条件重置stack


![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gj242yk65tj31120sata4.jpg)

我们每次更新都是从rootfiber开始，调用也是从其开始调用

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
1.  相同的root 但是任务有不同优先级的任务要渲染
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