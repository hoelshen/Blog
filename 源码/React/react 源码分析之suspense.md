# React.Suspense

Suspense 是什么

主要是用来处理还没有完成的事情（也就是异步，异步加载组件，异步请求数据）

Suspense 的主要解决问题其实是对于异步操作会多次 state 变化的问题。

## Suspense 是用来做什么的？

1. 代码拆分

服务于打包优化的代码拆分。lazy 和 suspense 配合使用

```js
const A = React.lazy(() => import('./A'))

return (
  <Suspense fallback={<p>loading</p>}>
    <Route component={A} path="/a">
  </Suspense>
)

```

当路由切换时，加载新的组件代码，代码加载是异步的过程，此时 suspense 就会进如 fallback，那我们看到的就是 loading，显式的告诉用户正在加载，当代码加载完成就会展示 A 组件的内容，整个 loading 状态不用开发者去控制。

2. 异步加载数据

## 更新

```js
export type SuspenseState = {|
  alreadyCaptured: boolean,
  didTimeout: boolean,
  timedOutAt: ExpirationTime,
|};
```

```js
if (finishedWork.effectTag & Callback) {
  const newState: SuspenseState = {
    alreadyCaptured: true,
    didTimeout: false,
    timedOutAt: NoWork,
  };
  finishedWork.memoizedState = newState;
  scheduleWork(finishedWork, Sync);
  return;
}
```
