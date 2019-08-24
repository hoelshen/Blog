
#ES6之类（一）

  上篇会讲 ES5相关的东西。
## 基础
![](http://pvt7l4h05.bkt.clouddn.com/2019-08-24-Pasted%20Graphic%2018.tiff)


我们先从

```js

class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();

```
  子类的 super.p()，就是将 super 当作是一个对象使用，super在普通方法中， 指向 A.prototype， 所以super.p()就相当于A.prototype.p(); 
  super 指向父类的原型对象， 所以定义在父类实例上的方法或属性，是无法通过 super 调用的。
```js
var o1 = {
  foo(){
    console.log('o1:foo')
  }
}

var o2 = {
  foo(){
    super.foo();
    console.log("o2: foo")
  }
}

// Object.setPrototypeOf(o2, o1);

o2.foo();

```
 o2.foo()方法中的 super 引用静态锁定到 o2,具体说是锁定到 o2 的[[Prototype]]。 基本上这里的 super 就是 Object.getPrototypeOf(o2) 
 






















































