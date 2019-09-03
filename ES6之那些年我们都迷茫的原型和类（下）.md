# ES6之类（二）

 这是下篇，讲述了类的一些常见用法和基本概念。对比了 ES5 与 ES6 的差异。

## 类

  实际上是特殊的函数，就像你能够定义的函数表达式和函数声明，类语法有两个组成部分： 类表达式和类声明。
  构造函数 、静态方法、原型方法、getter、setter
  一个构造函数方法是一个特殊方法， 其用于创建和初始化使用一个类创建的一个对象。
  一个狗找函数可以使用 super 关键字来调用一个父类的构造函数。
  静态方法：
  static 关键字来定义。调用静态类方法不需要实例话该类，但不能通过一个类实例调用静态方法。常用语为一个应用程序回创建工具函数。
  ⚠️： 只有静态方法 没有静态属性

## 表达式和声明

### 类声明

  定义一个类的一种方法是使用一个类声明。 要声明一个类， 你可以使用带有 class 关键字的类名

``` js
class Retctange {
    constructor(hight, width) {
        this.height = height;
        this.width = width;
    }
}
```

  函数声明和类声明之间的一个重要区别就是函数声明会提升， 类声明不会。例如下面例子

``` js
let p = new Retctange();
class Retctange {}
//Uncaught ReferenceError: Cannot access 'Retctange' before initialization
```

### 类表达式

  一个类表达式是定义一个类的另一种方式。类表达式可以是被命名的或者匿名的。 赋予一个命名类表达式的名称是类的主体的本地名称。

``` js
let person = new class {
    constructor(name) {
        this.name = name;
    }
    sayName() {
        console.log(this.name);
    }
}('张三');
person.sayName();
```

### ES6的继承

class 内定义的所有函数都会置于该类的原型当中。

``` js
  class Point {
      constructor() {
          // ...
      }
      toString() {
          // ...
      }
      toValue() {
          // ...
      }
  }
  // 等同于下边的代码
  Point.prototype.constructor = function() {}
  Point.prototype.toString = function() {}
  Point.prototype.toValue = function() {}
```

在类的实例上面调用方法， 其实就是调用原型上的方法。

``` js
  class Point {}
  var point = new Point()
  console.log(point.constructor === Point.prototype.constructor) // true
```

### class实现原理

ES5的继承，实质是先创造子类的实例对象 this， 然后再将父类的方法添加到 this 上面 Parent.apply(this), 
es6 的继承则是，将父类实例对象的属性和犯法，驾到this上面（所以必须先调用super方法）， 然后在用子类的构造函数修改this.
super在调用之后， 内部的 this 指向的是 child，

``` js
  class parent {}
  class Child extends Parent {}
  Child.__proto__ === Parent // 继承属性
  Child.prototype.__proto__ === Parent.prototype // 继承方法
```

``` js
class Point {}
var point = new Point()
console.log(point.constructor === Point.prototype.constructor) // true
```

``` js
class B {}
let b = new B();
b.constructor === B.prototype.constructor // true
```

b 是 B 类的实例。它的constructor方法就 是B 类原型的 constructor 方法。

``` js
class Foo {
    constructor() {
        return Object.create(null);
    }
}
// console.log('new Foo() instanceof Foo', new Foo() instanceof Foo);
//实例不再指向 Foo
```

类必须使用 new 调用，否则会报错。 这是它跟普通构造函数的一个主要区别，后面不用 new 也可以执行。

``` js
class Foo {
    constructor() {
        return Object.create(null);
    }
}
Foo()
```

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
实例不再指向 Foo

### new target

  这个属性能够用来确认构造函数是怎么调用

``` js
function Person(name) {
    if (new.target === Person) {
        this.name = name;
    } else {
        throw new Error('必须使用 new 命令生成实例');
    }
}
var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三'); // 报错
```

## ES5 和 ES6

### 共同点

1.name

``` js
class Point {}
Point.name // "Point"
```

``` js
const obj = function Person() {
    console.log('obj')

}
console.log('obj', obj.name)
```

ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被Class继承，包括name属性。

2. 他们之间的共同点。

``` js
class Animal {
    constructor(name) {
        this.name = name
    }
}
Animal.prototype.species = 'animal'
class Leo extends Animal {
    constructor(name) {
        super(name)
    }
}
```

constructor(){} 充当了之前的构造函数,  
super() 作为函数调用扮演着 Animal.call(this, name) 的角色(还可以表示父类). 最重要的是 Leo 的 _proto_ 也指向了 Animal.

``` js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}
var point = new Point(2, 3);
point.toString() // (2, 3)
point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString')
```

x 和 y 都是实例对象point 自身的属性（因为定义在 this 变量上）， 所以 hasOwnPropery 返回 true， 而toString 是原型对象的属性（定义在 Point类上）， 所以 hasOwnProperty 方法返回 false。

### 不同点

1. 不存在提升

  上面例子有讲，不在重复叙述。
2.this 的指向
  函数的this 是指向区分多种，在这里不做展开，我们只看最简单的例子。
  类的方法内部如果含有 this， 它默认指向类的实例。

```js

function A(){
   this.sayThis = function(){
    console.log('sayThis', this)
  }
}

const a = new A();
console.log('a', a.sayThis() )
console.log('a', sayThis() )

```

sayThis  //  A
sayThis() // window

``` js
class Logger {
  printName(name = 'there') {
      this.print( `Hello ${name}` );
  }

  print(text) {
      console.log(text);
  }
}

const logger = new Logger();
// const {
//   printName
// } = logger;

console.log('printName', logger.printName())
console.log('printName', printName())
```

printName  //Hello there
printName(); // TypeError: Cannot read property 'print' of undefined



我们可以用bind 解决 this 指向问题

```js
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }

  // ...
}
//或者
class Obj {
  constructor() {
    this.getThis = () => this;
  }
}
```

3. 私有变量和私有方法

  我们可以将私有方法移出模块，模块内部的所有方法都是对外可见的。

``` js
class Widget {
    constructor(snaf) {
        this.snaf = snaf;
    }
    foo(baz) {
        console.log(this.snaf)
        bar.call(this, baz);
    }
    // ...
}

function bar(baz) {
    console.log('baz', baz)
    return this.snaf = baz;
}

const widget = new Widget('obj');
const obj = widget.foo('1');
console.log('widget', widget.snaf)
console.log('obj', obj.snaf)
```

私有方法带#的提案

``` js
class Foo {
    #
    privateValue = 42;
    static getPrivateValue(foo) {
        return foo.#privateValue;
    }
}
console.log('Foo.getPrivateValue(new Foo());', Foo.getPrivateValue(new Foo())) //42
```

