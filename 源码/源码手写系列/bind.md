# bind

bind 函数的实现，需要了解 this 的绑定。this 绑定有 4 种绑定规则: 默认绑定、 隐式绑定、 显示绑定、 new 绑定

```js
Function.prototype.bind(context){
  
  // 1. 需要修改this
  let that = this;

  // 2. 获取参数， 从参数列表第一个开始获取，返回数组。获取解除绑定的 this 之外的其他参数
  let bindArgs = Array.prototype.slice.call(argument, 1);
  function Fn() {};

  // 3.
  function fBound(params){
    let args = Array.prototype.slice.call(argument);
    return that.apply(this instanceOf fBound // this instanceof fBound === 为 true 时，说明返回的 fBound 被当做 new 的构造函数调用
    ? this :
    context, bindArgs.concat(args));  // 获取调用时（fBound）的传参.bind 返回的函数入参往往是这么传递的， 即将 bind 函数中的除第一个参数之外的其他参数追加到实际执行中
  }

  // 维护原型关系
  if(this.prototype){
    // 此处获取原函数的原型， 返回fBound 时作为fBound的原型，维护原有的原型链
    Fn.prototype = this.prototype;
  }

  //下行的代码使 fBound.prototype 是 Fn 的实例， 因此
  // 返回的 fBound 若作为 new 的构造函数， new 生成的新对象作为 this 传入 fBound， 新对象 _proto__ 就是 Fn 的实例
  fBound.prototype = new Fn();

  return fBound;
}
```

我们最开始要绑定的函数称为fToBind， 返回值称为fBound， 从代码可以看到， bind执行的结果并没有返回fTobind，真正的待执行函数被封装在fBound里面。当我们绑定完成之后执行fBound的时候，在fBound内部fToBind会调用apply进行绑定并执行。而此时，apply的第一个参数已经是确定下来的了。接下来分为两种情况，当判断到当前函数是被当成构造函数执行时，此时忽略强行绑定，保留new操作；第二种情况是正常绑定，即获取bind函数传入的this进行绑定。

原因在于bind函数返回了一个新的函数fBound，fBound执行时，内部fToBind绑定所需要的this都已经确定下来了，当我们进行二次绑定时，操作的对象已经是fBound了，此时再进行bind操作时，我们只能改变fBound的this，但函数不作为构造函数执行时fBound内部的绑定操作并不依赖于fBound的this，而是依赖于第一次传入的oThis。所以不管我们再怎么绑定，都不能再改变绑定的结果了。

简单来说，再次bind的时候，我们已经无法对最原始的待绑定函数进行操作了，我们操作的只是它的代理。

