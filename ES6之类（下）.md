# ES6之类（二

## 类

  实际上是特殊的函数，就像你能够定义的函数表达式和函数声明，类语法有两个组成部分： 类表达式和类声明。

  定义一个类的一种方法是使用一个类声明。 要声明一个类， 你可以使用带有 class 关键字的类名

```js

class Retctange{
  constructor(hight, width){
    this.height  = height;
    this.width = width;

  }

}

```
  函数声明和类声明之间的一个重要区别就是函数声明会提升， 类声明不会。例如下面例子

  ```js


  let p = new Retctange();

  class Retctange{}


  //Uncaught ReferenceError: Cannot access 'Retctange' before initialization

  ```


  类表达式
  一个类表达式是定义一个类的另一种方式。类表达式可以是被命名的或者匿名的。 赋予一个命名类表达式的名称是类的主体的本地名称。


构造函数 、静态方法、原型方法、getter、setter


一个构造函数方法是一个特殊方法， 其用于创建和初始化使用一个类创建的一个对象。
一个狗找函数可以使用 super 关键字来调用一个父类的构造函数。

静态方法：
static 关键字来定义。调用静态类方法不需要实例话该类，但不能通过一个类实例调用静态方法。常用语为一个应用程序回创建工具函数。


我们先从

``` js
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

``` js
var o1 = {
    foo() {
        console.log('o1:foo')
    }
}

var o2 = {
    foo() {
        super.foo();
        console.log("o2: foo")
    }
}

// Object.setPrototypeOf(o2, o1);

o2.foo();
```

 o2.foo()方法中的 super 引用静态锁定到 o2, 具体说是锁定到 o2 的[[Prototype]]。 基本上这里的 super 就是 Object.getPrototypeOf(o2) 