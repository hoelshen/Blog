# ES5和ES6的区别

## ES5 的继承

实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）

## ES6 的继承

先创建父类实例 this 通过class、extends、super关键字定义子类，并改变 this 指向,
super 本身是指向父类的构造函数但做函数调用后返回的是子类的实例，
实际上做了父类.prototype.constructor.call(this)，
做对象调用时指向父类.prototype,从而实现继承。
  
```JS
//ES5
function Super() {}

function Sub() {}
Sub.prototype = new Super();
Sub.prototype.constructor = Sub;
 
var sub = new Sub();
 
Sub.prototype.constructor === Sub; // ② true
sub.constructor === Sub; // ④ true
sub.__proto__ === Sub.prototype; // ⑤ true
Sub.prototype.__proto__ == Super.prototype; // ⑦ true

```

```JS
// ES6
class Super {}

class Sub extends Super {}

var sub = new Sub();

Sub.prototype.constructor === Sub; // ② true
sub.constructor === Sub; // ④ true
sub.__proto__ === Sub.prototype; // ⑤ true
Sub.__proto__ === Super; // ⑥ true
Sub.prototype.__proto__ === Super.prototype; // ⑦ true
```

所以ES6和ES5的继承是一模一样的，只是多了class和extends，ES6的子类和父类，子类原型和父类原型，通过__proto__连接。
