# 原理

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
