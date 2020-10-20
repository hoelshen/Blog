# useState

## 用法

``` jsx
  const defaultCount = props.defaultCount || 0;
  const [count, setCount] = useState(defaultCount)
  //useState 按照第一次返回的顺序给你state的
  
  return(
    <button onClick={()=>{ setCount(1)}}>
      Click({count})
    </button>
  )

```

## 原理

```js
let state:[any] = [];
let cursor: number = 0;
function useState<T>(initState: T): [T, (setState: T)=> void]{
  const currentCursor = cursor;
  state[currentCursor] = state[currentCursor] || initState;
  function setState(newState: T){
    state[currentCursor] = newState
    render()
  }
  ++cursor

  return [state[currentCursor], setState]
}
```

## 坑

1.useState 必须要规规矩矩的写

```js
 let name ,setName;
  let count , setCount;
  id+=1;

  if(id & 1){
     [count, setCount] = useState(0)
     [name, setName] = useState('Mike')
  } else {
     [name, setName] = useState('mike')
     [count, setCount] = useState(0)
  }
  ()=>{
    console.log('initial count')
    return props.defaultCount || 0;
  }
```

这样子写会有问题


在初始的状态是保存在一个全局变量中的, 多个状态,应该是保存在一个专门的全局容器中. 



``` jsx


```



2.

##  原理

```js
function resolvDispatcher(){
  var dispatcher = ReactCurrentOwner.currentDispatcher;
  !(dispatcher !== null) ? invariant(false, 'hook can only be ...');
  return dispatcher
}
```
这个方法真正用的时候 要在我们 react 进行渲染的时候， 已经创建虚拟dom 的实例

```js
const queue = workInProgressHook.baseUpadte

// 接着我们判断
updateExpirationTime < renderExiprtaionTime


if(!didShip){
  newBaseUpdate = prevUpdate;
  newBaseState = _newState;
}

```

