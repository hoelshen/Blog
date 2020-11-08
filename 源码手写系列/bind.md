# bind

bind 函数的实现，需要了解 this 的绑定。this 绑定有 4 种绑定规则: 默认绑定、 隐式绑定、 显示绑定、 new 绑定

```js
Function.prototype.bind(context){
  
  // 1.
  let that = this;

  //2.
  let bindArgs = Array.prototype.slice.call(argument, 1);
  function Fn() {};

  //3.
  function fBound(params){
    let args = Array.prototype.slice.call(argument);
    return that.apply(this instanceOf fBound ? this : context, bindArgs.concat(args));
  }

  Fn.prototype = this.prototype;
  fBound.prototype = new Fn();

  return fBound;
}
```


```js
Function.prototype.bind =  function(argument){
  const that = this;
  let bindArgs = Array.prototype.slice.call(argument, 1);

  return function(argument){
    let innerArgs = Array.prototype.slice.call(argument);
    that.apply(context, [...bindArgs, ...innerArgs])
  }
}
```

