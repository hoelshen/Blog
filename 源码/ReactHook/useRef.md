# 原理

在 render 阶段标记 ref 标记，commit 阶段挂载 dom 节点时通过标记获取 dom 节点。主要实现流程如下：

1. 标记 Ref​
   标记 Ref​ 需要满足：

​mount​ 时：存在 ref​
​update​ 时：ref​ 引用变化

标记的时机包括：

​beginWork

2. 执行 Ref​ 操作

包括两类操作：

1. 对于正常的绑定操作：

   - 解绑之前的 ref​（mutation​ 阶段）
   - 绑定新的 ref​（layout​ 阶段）

1. 对于组件卸载：

   - 解绑之前的 re

## Mount

​mount​ 阶段主要是构建 hook 对象，并将 hook 对象添加到 fiber​ 节点的 hook 链表中。这也是所有 hook 在 mount​ 阶段的基本操作。

最后创建一个 current​ 对象，用来保存数据，这也就是 useRef​ 函数的返回值。

```jsx
function mountRef(initialValue) {
  // 构建hook对象并添加到链表中
  const hook = mountWorkInProgressHook();
  // 创建current对象
  const ref = { current: initialValue };
  // 保存current对象，这也是useRef函数返回的对象结果
  hook.memoizedState = ref;
  return ref;
}
```

在构建 hook 对象时会有两种情况，如果是第一个 hook 函数，需要将其保存在 fiber​ 节点的 memoizedState​ 属性中，如果是后续的 hook 函数，直接通过 next​ 指针连接

```jsx
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
    baseQueue: null,
    baseState: null,
  };
  if (workInProgressHook === null) {
    // mount时 第一个hook
    if (currentlyRenderingFiber === null) {
      throw new Error("请在函数组件内调用hook");
    } else {
      workInProgressHook = hook;
      currentlyRenderingFiber.memoizedState = workInProgressHook;
    }
  } else {
    // 后续的hook
    // 通过next指针连接
    workInProgressHook.next = hook;
    workInProgressHook = hook;
  }
  return workInProgressHook;
}
```

## Update

更新阶段由于并没有其他操作，所以只需要通过双缓存树的机制更新 hook 对象。

```jsx
function updateRef(initialValue) {
  // 更新hook对象
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
```

更新 hook 对象的本质是复用，通过 current​ 树中对应 fiber​ 节点的 hook 链表，来创建本次更新新的 hook 对象并更新链表

​currentHook​ 属性保存 current​ 树中上一个 hook 对应的对象，所以本次更新如果有值，通过 next​ 指针获取本次处理的 hook 对应的旧 hook 对象。如果没有值，说明当前 hook 函数为函数组件的第一个。

如果这两种情况都没有取到值，说明存在动态 hook 函数（本次更新比上一次更新 hooks 数量对应不上）。这种情况是 react 不被允许的，所以报错“本次执行时的 Hook 比上次执行时多”。

```jsx
function updateWorkInProgressHook() {
  let nextCurrentHook;

  if (currentHook === null) {
    // 这是这个函数组件update时的第一个hook
    const current = currentlyRenderingFiber?.alternate;
    if (current !== null) {
      // 获取对应的memoizedState属性
      nextCurrentHook = current?.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    // 这个函数组件update时 后续的hook
    nextCurrentHook = currentHook.next;
  }

  if (nextCurrentHook === null) {
    throw new Error(
      `组件${currentlyRenderingFiber?.type}本次执行时的Hook比上次执行时多`
    );
  }

  currentHook = nextCurrentHook;
  // 复用current树的旧hook对象属性
  const newHook = {
    memoizedState: currentHook.memoizedState,
    updateQueue: currentHook.updateQueue,
    next: null,
    baseQueue: currentHook.baseQueue,
    baseState: currentHook.baseState,
  };
  if (workInProgressHook === null) {
    // mount时 第一个hook
    if (currentlyRenderingFiber === null) {
      throw new Error("请在函数组件内调用hook");
    } else {
      workInProgressHook = newHook;
      currentlyRenderingFiber.memoizedState = workInProgressHook;
    }
  } else {
    // 后续的hook
    workInProgressHook.next = newHook;
    workInProgressHook = newHook;
  }
  return workInProgressHook;
}
```

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1geozbrcitqj30q60ffaan.jpg)

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1geozbrcitqj30q60ffaan.jpg)

类组件才能实例化
才能使用 refs
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1geozrwvw9kj30kj05agmf.jpg)

## 坑

1. 关于把 ref 对象作为 useCallback 依赖的做法

正常的话，ref 是不会变的，一直指向同一个对象。依然把它传递给 useCallback 的原因是，让 useCallback 的逻辑与变量 counterRef 的逻辑解耦。

意思就是对于 useCallback 的意义是：我不管 counterRef 会不会变，反正我依赖了它，为了我能正常运行，我必须把它声明出来。

你也可以这样理解，万一 counterRef 会变化，那么 useCallback 是不会受到影响的，这就是解耦合的意义所在，比如

const oneRef = useRef();
const twoRef = useRef();
const counterRef = <somecondition> ? oneRef : twoRef;

2. useRef 使用注意初始化

![useRef使用注意初始化](https://tva1.sinaimg.cn/large/007S8ZIlgy1gezql8pc2uj30f208u748.jpg)

ref 想象成类的属性变量，它的值在渲染周期之间可以保持，并且，和 state 的一个重要区别是，它的变化不会触发组件重新渲染。

useRef 可以传入初始值，你这个代码没有传入，因此直接当作函数来调用肯定报错的。

3. 同步不同渲染周期需要共用的数据, 只能设置在 useRef 的 current 属性上吗 ？

取决于这个数据的变更要不要触发重渲染，如果不重渲染，那么放 ref 是比较建议的做法；否则，就只能用 state 了。

```jsx
export default function App() {
  const [count, setCount] = useState(0);
  const preCountRef = useRef(count);
  useEffect(() => {
    preCountRef.current = count;
  });
  const preCount = preCountRef.current;

  return (
    <div className="App">
      <div
        onClick={() => {
          setCount((count) => count + 1);
        }}
      >
        <h1>
          Now:{count} preCount: {preCount}
        </h1>
      </div>
    </div>
  );
}
```

useEffect 它没有依赖参数，说明每一次组件的渲染，都会运行一次这个副作用。而 useEffect 是在每次的渲染后来执行的。因而我们又把本次渲染所使用的 count 保存在了 preCountRef 中
现在我们执行下一次渲染，先运行的代码是：

```jsx
const [count, setCount] = useState(0);
const prevCountRef = useRef();
const prevCount = prevCountRef.current;
```

这个就是典型的先渲染 jsx， 在执行 useEffect

ref 有个限制，那就是 ref 的 current 值改变的时候，并不会重新触发渲染，所以我们不能完全抛弃 useState 而只用 useRef。

```jsx
const [count, setCount] = useState(3);
const countRef = useRef(3);
const countDown = () => {
  var timer = setInterval(() => {
    // setCount((pre) => {
    //   if (pre === 0) {
    //     clearInterval(timer);
    //   }
    //   console.log("pre", pre);

    // });
    countRef.current -= 1;
    console.log("ref", countRef.current);
    if (countRef.current === 0) {
      clearInterval(timer);
    }
  }, 1000);
};
```
