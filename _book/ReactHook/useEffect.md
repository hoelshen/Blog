# useEffect

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


如果有传入的第二个return 

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

第二个参数 undefin 空数组 非数组

## 原理

## 坑

