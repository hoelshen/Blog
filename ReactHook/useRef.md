# 原理

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1geozbrcitqj30q60ffaan.jpg)

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1geozbrcitqj30q60ffaan.jpg)


类组件才能实例化
才能使用refs
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1geozrwvw9kj30kj05agmf.jpg)



## 坑

1. 关于把ref对象作为useCallback依赖的做法

正常的话，ref是不会变的，一直指向同一个对象。依然把它传递给useCallback的原因是，让useCallback的逻辑与变量counterRef的逻辑解耦。

意思就是对于useCallback的意义是：我不管counterRef会不会变，反正我依赖了它，为了我能正常运行，我必须把它声明出来。

你也可以这样理解，万一counterRef会变化，那么useCallback是不会受到影响的，这就是解耦合的意义所在，比如

const oneRef = useRef();
const twoRef = useRef();
const counterRef = <somecondition> ? oneRef : twoRef;

2. useRef使用注意初始化

![useRef使用注意初始化](https://tva1.sinaimg.cn/large/007S8ZIlgy1gezql8pc2uj30f208u748.jpg)

ref想象成类的属性变量，它的值在渲染周期之间可以保持，并且，和state的一个重要区别是，它的变化不会触发组件重新渲染。

useRef可以传入初始值，你这个代码没有传入，因此直接当作函数来调用肯定报错的。

3. 同步 不同渲染周期需要共用的数据 只能设置在 useRef 的 current属性上吗 ？

取决于这个数据的变更要不要触发重渲染，如果不重渲染，那么放ref是比较建议的做法；否则，就只能用state了。

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
useEffect 它没有依赖参数，说明每一次组件的渲染，都会运行一次这个副作用。而useEffect 是在每次的渲染后来执行的。因而我们又把本次渲染所使用的count 保存在了preCountRef中
现在我们执行下一次渲染，先运行的代码是：

```jsx

const [count, setCount] = useState(0);
const prevCountRef = useRef();
const prevCount = prevCountRef.current;
```
这个就是典型的先渲染jsx， 在执行useEffcet