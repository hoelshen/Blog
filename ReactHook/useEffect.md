# useEffect 与 useLayoutEffect
  
  执行的时机,赋值给 useEffect 的函数会在组件渲染到屏幕之后执行。 在函数组件主体内()这里指 react 渲染阶段 改变 dom, 添加订阅设置定时器, 或执行其他包含副作用的操作都是不被允许的,因为这可能产生莫名其妙的 bug.

## 原理

其函数签名与 useEffect 相同，但它**会在所有的 DOM 变更之后同步调用** effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

```js
useLayOutEffect(){
  useEffectImpl(UpadteEffect, UnmountMutation | MountLayout, create, inputs)
}
useEffect(){
  useEffectImpl(
    UpadteEffect | PassiveEffect,
    UnmountMutation | MountPassive, create, inputs)
}
```

因为他是匿名函数 所以每次都不一样

```js
function useEffectImpl(fiberEffectTag, hookEffectTag, create, inputs): void {
  workInProgressHook = createWorkInProgressHook();
  let nextInputs = inputs !== undefined && inputs !== null ? inputs : [create];
  componentUpadteQueue.lastEffect = effect.next = effect

}
```

接着 commitHookEffectList 这个方法

如果有传入的第二个return 消除副作用

我们就去执行 destory() 方法

```js
const destory = effect.destory;
effect.destory = null;
if(destory != null){
  destory()
}
```

```js
function commitLifeCycles(
  finishedRoot: FiberRoot,
  current: Fiber | null,
  finishedWork: Fiber,
  committedExpirationTime: ExpirationTime,
): void {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      commitHookEffectList(UnmountLayout, MountLayout, finishedWork);
      break;
    }
  }
}
```

## 用法

```jsx
function App2(props) {
  const [count, setCount] = useState(0);
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  });
  //useState 按照第一次返回的顺序给你state的

  useEffect(() => {
    document.title = count;
  });

  useEffect(() => {
    console.log("count", count);
  }, [count]);

  useEffect(() => {
    window.addEventListener("resize", onResize, false);
    return () => {
      window.removeEventListener("resize", onResize, false);
    };
  }, []);

  useEffect(() => {
    document.querySelector('#size').addEventListener("click", onClick, false);
/*     return () => {
      document.querySelector('#size').removeEventListener("click", onClick, false);
    }; */
  });

  const onClick = () => {
    console.log("click");
  };

  const onResize = () => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    });
  };
  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Click({count})
      </button>
      {count % 2 ? (
        <span id="size">
          size:({size.width}, {size.height})
        </span>
      ) : (
        <p id="size">
          size:({size.width}, {size.height})
        </p>
      )}
    </div>
  );
}

```

// 不太关心是mount 还是update

第二个传入的参数表达的意思是只有第二个参数数组每一项都不变的情况下 useEffect 才不会执行

第二个参数 undefined 空数组 非数组

## 原理
  
```js
const allDeps: any[][] = [];
let effectCursor: number = 0;
function useEffect(callbak: () => void, deps:any[]){
  if(!allDeps[effectCursor]){
    //  初次渲染: 赋值 + 调用回调函数
    allDeps[effectCursor]= deps;
    ++effectCursor;
    callbak();
    return
  }

  const currentEffectCursor = effectCursor;
  const rawDeps = allDeps[currentEffectCursor];

  const isChanged = rawDeps.some(
    (dep: any, index: number) => dep !== deps[index]
  );

  if(isChanged){
    callbak();
    allDeps[effectCursor] = deps;
  }
  ++effectCursor;
}



const rootElement = document.getElementById("root");
render(<App />, rootElement);

```

## 流程

1. react 在 diff 后，会进入到 commit 阶段，准备把虚拟 DOM 发生的变化映射到真实 DOM 上

2. 在 commit 阶段的前期，会调用一些生命周期方法，对于类组件来说，需要触发组件的 getSnapshotBeforeUpdate 生命周期，对于函数组件，此时会调度 useEffect 的 create destroy 函数

3. 注意是调度，不是执行。在这个阶段，会把使用了 useEffect 组件产生的生命周期函数入列到 React 自己维护的调度队列中，给予一个普通的优先级，让这些生命周期函数异步执行

```js
// 可以近似的认为，React 做了这样一步，实际流程中要复杂的多

setTimeout(() => {
      const preDestory = element.destroy;
      if (preDestory) prevDestroy();
      const destroy = create();
      element.destroy= destroy;
}, 0);

```

4. 随后，就到了 React 把虚拟 DOM 设置到真实 DOM 上的阶段，这个阶段主要调用的函数是 commitWork，commitWork 函数会针对不同的 fiber 节点调用不同的 DOM 的修改方法，比如文本节点和元素节点的修改方法是不一样的。

5. commitWork 如果遇到了类组件的 fiber 节点，不会做任何操作，会直接 return，进行收尾工作，然后去处理下一个节点，这点很容易理解，类组件的 fiber 节点没有对应的真实 DOM 结构，所以就没有相关操作

6. 但在有了 hooks 以后，函数组件在这个阶段，会同步调用上一次渲染时 useLayoutEffect(create, deps) create 函数返回的 destroy 函数

7. 注意一个节点在 commitWokr 后，这个时候，我们已经把发生的变化映射到真实 DOM 上了

8. 但由于 JS 线程和浏览器渲染线程是互斥的，因为 JS 虚拟机还在运行，即使内存中的真实 DOM 已经变化，浏览器也没有立刻渲染到屏幕上

9. 此时会进行收尾工作，同步执行对应的生命周期方法，我们说的componentDidMount，componentDidUpdate 以及 useLayoutEffect(create, deps) 的 create 函数都是在这个阶段被同步执行。

10. 对于 react 来说，commit 阶段是不可打断的，会一次性把所有需要 commit 的节点全部 commit 完，至此 react 更新完毕，JS 停止执行

11. 浏览器把发生变化的 DOM 渲染到屏幕上，到此为止 react 仅用一次回流、重绘的代价，就把所有需要更新的 DOM 节点全部更新完成

12. 浏览器渲染完成后，浏览器通知 react 自己处于空闲阶段，react 开始执行自己调度队列中的任务，此时才开始执行 useEffect(create, deps) 的产生的函数

## 坑

* useEffect 和 useLayoutEffect的区别

useEffect 在渲染时是异步执行，并且要等到浏览器将所有变化渲染到屏幕后才会被执行。

useLayoutEffect 在渲染时是同步执行，其执行时机与 componentDidMount，componentDidUpdate 一致

* 对于 useEffect 和 useLayoutEffect 哪一个与 componentDidMount，componentDidUpdate 的是等价的

useLayoutEffect，因为从源码中调用的位置来看，useLayoutEffect的 create 函数的调用位置、时机都和 componentDidMount，componentDidUpdate 一致，且都是被 React 同步调用，都会阻塞浏览器渲染

* useEffect 和 useLayoutEffect 哪一个与 componentWillUnmount 的是等价的
同上，useLayoutEffect 的 detroy 函数的调用位置、时机与 componentWillUnmount 一致，且都是同步调用。useEffect 的 detroy 函数从调用时机上来看，更像是 componentDidUnmount (注意React 中并没有这个生命周期函数)。

* 为什么建议将修改 DOM 的操作里放到 useLayoutEffect 里，而不是 useEffect？

可以看到在流程9/10期间，DOM 已经被修改，但浏览器渲染线程依旧处于被阻塞阶段，所以还没有发生回流、重绘过程。由于内存中的 DOM 已经被修改，通过 useLayoutEffect 可以拿到最新的 DOM 节点，并且在此时对 DOM 进行样式上的修改，假设修改了元素的 height，这些修改会在步骤 11 和 react 做出的更改一起被一次性渲染到屏幕上，依旧只有一次回流、重绘的代价。

如果放在 useEffect 里，useEffect 的函数会在组件渲染到屏幕之后执行，此时对 DOM 进行修改，会触发浏览器再次进行回流、重绘，增加了性能上的损耗。

我们来浅析一下

每个 Effect 必然在渲染之后执行，因此不会阻塞渲染，提高了性能
在运行每个 Effect 之前，运行前一次渲染的 Effect Cleanup 函数（如果有的话）
当组件销毁时，运行最后一次 Effect 的 Cleanup 函数

## 参考资料
[用动画和实战打开 React Hooks（一）：useState 和 useEffect](https://tuture.blog.csdn.net/article/details/105744082?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param)


