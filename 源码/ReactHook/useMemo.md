

## 原理

```js

export function useMemo<T>(
  nextCreate: () => T,
  inputs: Array<mixed> | void | null,
): T {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber();
  workInProgressHook = createWorkInProgressHook();

  const nextInputs =
    inputs !== undefined && inputs !== null ? inputs : [nextCreate];

  const prevState = workInProgressHook.memoizedState;
  if (prevState !== null) {
    const prevInputs = prevState[1];
    if (areHookInputsEqual(nextInputs, prevInputs)) {
      return prevState[0];
    }
  }

  const nextValue = nextCreate();
  workInProgressHook.memoizedState = [nextValue, nextInputs];
  return nextValue;
}


```

这方法执行的结果对比

## 用法
useMemo是不是有点像vue中的计算属性 只有useMemo(() => {}, []) 第二个依赖项shallowEqual相等才重新执行函数并将结果作为useMemo的返回值
useMemo 的含义是，通过一些变量计算得到新的值。通过把这些变量加入依赖 deps，当 deps 中的值均未发生变化时，跳过这次计算。useMemo 中传入的函数，将在 render 函数调用过程被同步调用。
可以使用 useMemo 缓存一些相对耗时的计算。
除此以外，useMemo 也非常适合用于存储引用类型的数据，可以传入对象字面量，匿名函数等，甚至是 React Elements。

```jsx
const data = useMemo(() => ({
    a,
    b,
    c,
    d: 'xxx'
}), [a, b, c]);

// 可以用 useCallback 代替
const fn = useMemo(() => () => {
    // do something
}, [a, b]);

const memoComponentsA = useMemo(() => (
    <ComponentsA {...someProps} />
), [someProps]);


```

对于对象和数组,如果某个子组件使用了它作为props, 减少它的重新生成,就能避免子组件不必要的重复渲染,提升性能.

```jsx
const data = { id };

return <Child data={data}>;
```

```jsx
const data = useMemo(() => ({ id }), [id]);

return <Child data={data}>;
```

## 原理

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdz42f4l0sj30h20b4dg3.jpg)

## 坑
useMemo并不能够控制子组件的渲染，它用来控制它包装的函数的重新执行

使用 useMemo 当 deps 不变时，直接返回上一次计算的结果，从而使子组件跳过渲染。
但是当返回的是原始数据类型（如字符串、数字、布尔值）。即使参与了计算，只要 deps 依赖的内容不变，返回结果也很可能是不变的。此时就需要权衡这个计算的时间成本和 useMemo 额外带来的空间成本（缓存上一次的结果）了。
此外，如果 useMemo 的 deps 依赖数组为空，这样做说明你只是希望存储一个值，这个值在重新 render 时永远不会变。

