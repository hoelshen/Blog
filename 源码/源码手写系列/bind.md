# bind

bind 函数的实现，需要了解 this 的绑定。this 绑定有 4 种绑定规则: 默认绑定、 隐式绑定、 显示绑定、 new 绑定

```js
Function.prototype.myBind = function (context) {
  // 1. 保存原始函数
  let that = this;

  // 添加类型检查
  if (typeof that !== "function") {
    throw new TypeError("myBind must be called on a function");
  }

  // 2. 获取参数，从参数列表第一个开始获取，返回数组。获取除绑定的 this 之外的其他参数
  let bindArgs = Array.prototype.slice.call(arguments, 1);

  // 3. 返回一个新函数
  function fBound() {
    let args = Array.prototype.slice.call(arguments); // 获取调用时的参数
    return that.apply(
      this instanceof fBound ? this : context, // 如果是 new 调用，this 指向实例，否则指向 context
      bindArgs.concat(args) // 合并预设参数和调用时参数
    );
  }

  // 维护原型关系
  if (this.prototype) {
    // 此处获取原函数的原型，作为 fBound 的原型，维护原有的原型链
    fBound.prototype = Object.create(this.prototype);
  }

  return fBound;
};
```

我们最开始要绑定的函数称为 fToBind， 返回值称为 fBound， 从代码可以看到， bind 执行的结果并没有返回 fTobind，真正的待执行函数被封装在 fBound 里面。当我们绑定完成之后执行 fBound 的时候，在 fBound 内部 fToBind 会调用 apply 进行绑定并执行。而此时，apply 的第一个参数已经是确定下来的了。接下来分为两种情况，当判断到当前函数是被当成构造函数执行时，此时忽略强行绑定，保留 new 操作；第二种情况是正常绑定，即获取 bind 函数传入的 this 进行绑定。

原因在于 bind 函数返回了一个新的函数 fBound，fBound 执行时，内部 fToBind 绑定所需要的 this 都已经确定下来了，当我们进行二次绑定时，操作的对象已经是 fBound 了，此时再进行 bind 操作时，我们只能改变 fBound 的 this，但函数不作为构造函数执行时 fBound 内部的绑定操作并不依赖于 fBound 的 this，而是依赖于第一次传入的 oThis。所以不管我们再怎么绑定，都不能再改变绑定的结果了。

简单来说，再次 bind 的时候，我们已经无法对最原始的待绑定函数进行操作了，我们操作的只是它的代理。

// bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )

<!-- 现代写法 -->

```js
Function.prototype.bind = function (ctx, ...bindArgs) {
  // 保存当前函数(this)
  const fn = this;
  if (typeof fn !== "function") {
    throw new TypeError("myBind must be called on a function");
  }
  // 返回一个新函数
  return function fBound(...newArgs) {
    // 合并参数
    return fn.apply(
      this instanceof fBound ? this : ctx,
      bindArgs.concat(newArgs)
    );
  };
};
```
