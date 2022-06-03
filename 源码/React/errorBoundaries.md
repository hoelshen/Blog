#

错误边界就是 一个生命周期，用来监听当前组件的children渲染过程，并可以返回一个降级的UI来渲染。

<https://live.bytedance.com/9788/9071260>

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 我们可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 我们可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}


```

render => 任务调度 => 任务循环 => 提交 => 展示

抛出的异常会进入到我们的handleError 流程此时我们处理的目标。

```js
function handleError(root, thrownValue): void {
  let erroredWork = workInProgress; // 当前处理的 FiberNode 也就是异常的 节点
  throwException(
    root, // 我们的根 FiberNode
    erroredWork.return, // 父节点
    erroredWork,
    thrownValue, // 异常内容
  );
    completeUnitOfWork(erroredWork);
}

function throwException(
  root: FiberRoot,
  returnFiber: Fiber,
  sourceFiber: Fiber,
  value: mixed,
) {
  // The source fiber did not complete.
  sourceFiber.flags |= Incomplete;

  let workInProgress = returnFiber;
  do {
    switch (workInProgress.tag) {
      case HostRoot: {
        workInProgress.flags |= ShouldCapture;
        return;
      }
      case ClassComponent:
        // Capture and retry
        const ctor = workInProgress.type;
        const instance = workInProgress.stateNode;
        if (
          (workInProgress.flags & DidCapture) === NoFlags &&
          (typeof ctor.getDerivedStateFromError === 'function' ||
            (instance !== null &&
              typeof instance.componentDidCatch === 'function' &&
              !isAlreadyFailedLegacyErrorBoundary(instance)))
        ) {
          workInProgress.flags |= ShouldCapture;
          return;
        }
        break;
      default:
        break;
    }
    workInProgress = workInProgress.return;
  } while (workInProgress !== null);
}


```

throwException

将当前也就是出问题的节点状态标志为未完成 FiberNode.flags = Incomplete
从父节点开始冒泡，向上寻找有能力处理异常（ ClassComponent ）且的确处理了异常的（声明了 getDerivedStateFromError 或 componentDidCatch 生命周期）节点，如果有，则将那个节点标志为待捕获 workInProgress.flags |= ShouldCapture ，如果没有则是根节点。
completeUnitOfWork 方法也类似，从父节点开始冒泡，找到 ShouldCapture 标记的节点，如果有就标记为已捕获 DidCapture ，如果没找到，则一路把所有的节点都标记为 Incomplete 直到根节点，并把 workInProgress 指向当前捕获的节点。

之后从当前捕获的节点（也有可能没捕获是根节点）开始重新走流程，由于其状态 react 只会渲染其降级 UI，如果有 sibling 节点则会继续走下面的流程。我们看看上述例子最终得到的 FiberNode 树：
