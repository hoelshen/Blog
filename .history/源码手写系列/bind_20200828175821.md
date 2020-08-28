#  bind

```js
Function.prototype.bind(context){
  let that = this;
  let bindArgs = Array.prototype.slice.call(argument, 1);
  function Fn() {};
  function fBound(params){
    let args = Array.prototype.slice.call(argument);
    return that.apply(this instanceof fBound ? this : context, bindArgs.concat(args));
  }

  Fn.prototype = this.prototype;
  fBound.prototype = new Fn();

  return fBound;
}
```