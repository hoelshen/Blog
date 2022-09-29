FiberRoot
我们会创建一个 reactelement 它会有一个 fiberroot
Fiber

每一个 reactElement 对应一个 Fiber 对象

## Fiber

记录节点的各种状态
串联整个应用形成树结构
不是直接调理 reactElement,先是在 fiber 上面进行的，例如 state props 最后更新的时候才对应到 this 上面。

fiber 有 下面几个比较重要的属性：

```js
{
  //标记不同类型的tag
  tag: workTag,
  return: Fiber | null,

  // 单链表树结构
  // 指向自己的第一个子节点
  child: Fiber | null,
  // 指向自己的兄弟结构
  // 兄弟节点的return指向同一个父节点
  sibling: Fiber | null,
}
```

## DOMRender

做一个 updateContainer

```js
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
)

```

## 什么是 Update

首先要生成一个 update，不管你是 setState 还是 ReactDOM.render 造成的 React 更新，都会生成一个叫 update 的对象，并且会赋值给 Fiber.updateQueue

- 用于记录组件状态的改变

- 存放于 UpdateQueue 中

- 多个 Update 可以同时存在

update 和 updateQueue

```js
export type Update<State> = {
  // 更新的过期时间
  expirationTime: ExpirationTime,

  // export const UpdateState = 0;
  // export const ReplaceState = 1;
  // export const ForceUpdate = 2;
  // export const CaptureUpdate = 3;
  // 指定更新的类型，值为以上几种
  tag: 0 | 1 | 2 | 3,
  // 更新内容，比如`setState`接收的第一个参数
  payload: any,
  // 对应的回调，`setState`，`render`都有
  callback: (() => mixed) | null,

  // 指向下一个更新
  next: Update<State> | null,
  // 指向下一个`side effect`
  nextEffect: Update<State> | null,
};
```

```js
export type UpdateQueue<State> = {
  // 每次操作完更新之后的`state`
  baseState: State,

  // 队列中的第一个`Update`
  firstUpdate: Update<State> | null,
  // 队列中的最后一个`Update`
  lastUpdate: Update<State> | null,

  // 第一个捕获类型的`Update`
  firstCapturedUpdate: Update<State> | null,
  // 最后一个捕获类型的`Update`
  lastCapturedUpdate: Update<State> | null,

  // 第一个`side effect`
  firstEffect: Update<State> | null,
  // 最后一个`side effect`
  lastEffect: Update<State> | null,

  // 第一个和最后一个捕获产生的`side effect`
  firstCapturedEffect: Update<State> | null,
  lastCapturedEffect: Update<State> | null,
};
```

在当前节点对应的 Fiber 对象上创建了 Update 之后，进就如 scheduleWork 调度阶段。

现在 workInProgress 上更新，更新完之后在鱼 current 交换， 更新出错还可以回滚。

expirationTime

React 中有两种类型的 ExpirationTime，一个是 Interactive 的，另一种是普通的异步。Interactive 的比如说是由事件触发的，那么他的响应优先级会比较高因为涉及到交互。

案，直到有一天我盯着代码发呆，看到 LOW_PRIORITY_BATCH_SIZE 这个字样，bacth，是不是就对应 batchedUpdates？再细想了一下，这么做也许是为了让非常相近的两次更新得到相同的 expirationTime，然后在一次更新中完成，相当于一个自动的 batchedUpdates。

说 React 要求在一次 rendering 过程中，新产生的 update 用于计算过期时间的 current 必须跟目前的 renderTime 保持一致，同理在这个周期中所有产生的新的更新的过期时间都会保持一致

suspendedTime
同样的在 ReactFiber 上有两个值 earliestSuspendedTime 和 lastestSuspendedTime，这两个值是用来记录被挂起的任务的过期时间的

不同的 expirationTime

- sync 模式 执行几更新
- 异步模式 执行后加入更新队列中
- 指定 context

我们可以根据 Mode 得出有没有属性或者相不相等

```js
export type TypeOfMode = number;

export const NoContext = 0b000;
export const ConcurrentMode = 0b001;
export const StrictMode = 0b010;
export const ProfileMode = 0b100;
```

Mode = Mode | b; 代表将 b 赋值给 mode
设置一个 Mode 如果 Mode & b 为 1 则代表没有这个属性 如果为 0 则有

核心

给节点的 Fiber 创建更新

更新的类型不同

setState 时把组件的 rootFiber 加入到调度队列,我们有 barchedUpdate,每次 setState 并不一定只有一个组件被更新，第二把 root 加入队列是为了更好得进行调度，我们可以把所有更新的优先级都列在 root 上，以便删选。

调用 this。setState 是一个组件级的调用，只会存在发起 setState 的组件里面。简单来说，只有 Class 组件和使用 Hooks 的函数组件对应的 Fiber 对象 updateQueue 有用，其他节点是没用的。将来 React 会对 Fiber 对象的类型进行区分，对于一些属性在没有必要的节点上就不存在了。

16.7 统一按照越大的优先级越高的模式走了，之前 Sync 是等一 1，16.7 里面 Sync 是 maxIntxxxxx 了。但是原理是一样的，就是判断优先级换了个方法，不需要先判断是否等于 Sync

你需要区别 FiberRoot 和 RootFiber，后者是 Fiber 对象，前者则是 RootFiber 的 stateNode

FiberRoot 是根节点
