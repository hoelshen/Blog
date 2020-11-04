# new

当你执行

```js
var  o = new Foo();
```

实际上是

```js
var o = new Object();
o.__proto__ = Foo.prototype;
Foo.call(o);
```

## 实现代码

```js
const myNew = function(){
  let Constructor = Array.prototype.shift.call(arguments);
  let obj = {};
  obj.__proto__ = Constructor.prototype;

  let res = Constructor.apply(obj, arguments);

  return res instanceOf Object ? res : obj;
}

```

* 创建一个全新的对象

* 这个对象被执行【【prototype】】连接

* 将这个对象绑定到构造函数中的 this

* 如果函数没有返回其他对象， 则 new 操作符调用的函数则会返回这个对象

可以看出，在 new 执行过程中的第三步， 会对函数调用的 this 进行修改。 在我们简易版的 bind 函数里， 原函数调用中的 this 永远执行制定的对象， 而不能根据如果是 new 调用而绑定到 new 创建的对象。 所以，我们要对原函数的调用进行判断， 是否是 new 调用。
