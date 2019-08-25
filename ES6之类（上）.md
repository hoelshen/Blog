
#ES6之类（一）

  本文会分为上下两篇。上篇会讲 ES5 相关的东西， 下篇会讲 ES6 相关的东西。

## 基础

![](http://pvt7l4h05.bkt.clouddn.com/2019-08-24-Pasted%20Graphic%2018.tiff)

 我们先来写最简单的
  ```js

  function Person(name, age, sex){
    this.name = name;
    this.age = age;
    this.sex =sex;
  }


  Person.prototype.sayHello = function(){
    console.log(this.name)
  }

```


这是我们构造函数的方法,我们添加下面东西 看能输出什么

```js

var obj1 = new Person('red', 10, 'man');
var obj2 = new Person('yellow', 11, 'male');
console.log('obj1.sayHello === obj2.sayHello',obj1.sayHello === obj2.sayHello)

```

 通过构造函数生成的实例对象时，会自动为实例对象分配原型对象。每个构造函数都有一个  prototype 属性， 这个属性就是实例对象的原型对象。

 原型对象上的所有属性和方法， 都能被派生对象共享。

```js

function Person(name){

}

Person.prototype = {
  constructor : Person,
  sayHello: function(){


  }
}

```
注意：需注意的是在上面的代码中，我们将 Person.prototype 设置为一个新创建的对象。会导致 Person.prototype 对象原来的 constructor 属性不再指向 Person, 这里可以像上面那样，特意的把 constructor 设置为 Person 。







函数声明 



函数表达式



//原型链与继承 class

constructor 是绑在实例上面的，不是绑在原型链上面的。








new 产生的对象  类型是object  实例对象是各个类型 Array  Number 

object.prototype.toString Array  Number

undefined 比较特殊 Object



多态  继承  重载









































