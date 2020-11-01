# useCallback

这是对事件句柄进行缓存，useState的第二个返回值是dispatch，但是每次都是返回新的，使用useCallback，可以让它使用上次的函数。

## 原理

```js
export function useCallback<T>(
  callback: T,
  inputs: Array<mixed> | void | null,
): T {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber();
  workInProgressHook = createWorkInProgressHook();

  const nextInputs =
    inputs !== undefined && inputs !== null ? inputs : [callback];

  const prevState = workInProgressHook.memoizedState;
  if (prevState !== null) {
    const prevInputs = prevState[1];
    if (areHookInputsEqual(nextInputs, prevInputs)) {
      return prevState[0];
    }
  }
  workInProgressHook.memoizedState = [callback, nextInputs];
  return callback;
}



```

为了向下传递子组件


```jsx
  const onClick = useCallback(()=>{
    console.log('Click')
    setClickCount(clickCount + 1);
    console.log(counterRef.current)
  }, [counterRef])
```


## 遇到的坑

```jsx
function App() {
  const [clickCount, setClickCount] = useState(0);  
 
  const handleClick = useCallback(() => {
    setClickCount(clickCount + 1);
  }, [clickCount === 2]);
 
  return (
    <div>
        <button onClick={handleClick}>Press</button>
        <span>{clickCount}</span>
    </div>
  )
}
 
export default App;

```
clickCount === 2这个表达式的值没变，造成了handleClick没变，同时里面引用的上下文也没变，clickCount一直停留在0的状态，即使加1，最多也就变成1，并不会再变了。

具体是这样的过程：

1. 首次渲染，handleClick所指向的这个函数，它读取到的上下文是 {clickCount: 0}；

2. 点击按钮，调用 setClickCount，clickCount变成1，触发第二次渲染；

3. 第二次渲染，计算useCallback的第二个参数，发现依然是false，那么useCallback依然会返回之前的函数给 handleClick，handleClick内部能读取到的 clickCount 依然是0；

4. 再次点击按钮，调用handleClick，setClickCount还是只能传入 0+1，还是1，React发现数据相同，不会触发重新渲染；

5. 一直保持这个状态

之所以出现这个问题是实际上引入了一个闭包，也就是handleClick引用了外部上下文的数据，而作为函数组件，每次重新渲染，都会创建一个新的上下文，而handleClick句柄指向的还是旧上下文。

解决这个问题很简单，就是传入函数给 setClickCount：

setClickCount(count => count + 1)
这样并没有引用任何上下文的数据，因此是安全的。当然把useCallback的第二个参数改成 [clickCount] 或者不加第二个参数也能解决问题。


作为第二个依赖参数，没有满足与不满足的说法，只有变化与未变化，只有变化了才会重新执行，第一次渲染的时候，无从对比，都会先执行一次，不论useMemo/useCallback还是useEffect。



那么如何定义这个依赖数组呢？严格来讲，只要用到了变量，就需要声明到里面，包括函数变量。不过也有例外，比如“setState”这一类函数，React官方已经保证，对于同一个组件的同一个state，它的setState每次都返回同一个，因此它是一种“常量”。对于其它已经被保证不会变化的变量，也不需要放到依赖数组中。

同样是调用了setCount函数，也有两种方式：

setCount(1 + count)
上面这种需要引用count参数，因此count是一种依赖。

setCount(count => count + 1)
上面这种只引用了setCount函数，而我们讲到它是“常量”，因此依赖数组中什么都不必写。

















