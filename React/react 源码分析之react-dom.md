

FiberRoot
我们会创建一个 reactelement 它会有一个 fiberroot
Fiber

每一个reactElement 对应一个Fiber 对象

## Fiber
记录节点的各种状态
串联整个应用形成树结构
不是直接调理reactElement,先是在 fiber 上面进行的，例如 state props 最后更新的时候才对应到this上面。


fiber有 下面几个比较重要的属性：
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

做一个updateContainer

```js
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
)

```

## 什么是Update

首先要生成一个update，不管你是setState还是ReactDOM.render造成的 React 更新，都会生成一个叫update的对象，并且会赋值给Fiber.updateQueue

* 用于记录组件状态的改变

* 存放于UpdateQueue中

* 多个Update可以同时存在

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
在当前节点对应的Fiber对象上创建了Update之后，进就如scheduleWork调度阶段。

现在workInProgress上更新，更新完之后在鱼current 交换， 更新出错还可以回滚。


expirationTime

React 中有两种类型的ExpirationTime，一个是Interactive的，另一种是普通的异步。Interactive的比如说是由事件触发的，那么他的响应优先级会比较高因为涉及到交互。

案，直到有一天我盯着代码发呆，看到LOW_PRIORITY_BATCH_SIZE这个字样，bacth，是不是就对应batchedUpdates？再细想了一下，这么做也许是为了让非常相近的两次更新得到相同的expirationTime，然后在一次更新中完成，相当于一个自动的batchedUpdates。

说 React 要求在一次rendering过程中，新产生的update用于计算过期时间的current必须跟目前的renderTime保持一致，同理在这个周期中所有产生的新的更新的过期时间都会保持一致

suspendedTime
同样的在ReactFiber上有两个值earliestSuspendedTime和lastestSuspendedTime，这两个值是用来记录被挂起的任务的过期时间的


不同的expirationTime

* sync模式  执行几更新
* 异步模式  执行后加入更新队列中
* 指定context  

我们可以根据Mode 得出有没有属性或者相不相等

```js

export type TypeOfMode = number;

export const NoContext = 0b000;
export const ConcurrentMode = 0b001;
export const StrictMode = 0b010;
export const ProfileMode = 0b100;

```
Mode = Mode | b; 代表将b 赋值给 mode
设置一个Mode 如果Mode & b 为1 则代表没有这个属性 如果为 0 则有


核心

给节点的Fiber创建更新

更新的类型不同











































































