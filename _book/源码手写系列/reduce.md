
```js
Array.prototype.reduce = function(func, initState){
  const arr = this;
  const callback = func

  let init = initState

  arr.forEach(function(value, index){
    init = callback(init, value)
  })
  return init
}

```