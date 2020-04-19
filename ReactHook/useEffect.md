# useEffect

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

