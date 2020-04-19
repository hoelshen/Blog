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

## 坑
1.useState 必须要规规矩矩的写

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


这样子写会有问题


``` jsx
()=>{
    console.log('initial count')
    return props.defaultCount || 0;
  }

```
2.
