# ES5和ES6的区别

## ES5 的继承

实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）


## ES6 的继承

先创建父类实例this 通过class丶extends丶super关键字定义子类，并改变this指向,super本身是指向父类的构造函数但做函数调用后返回的是子类的实例，实际上做了父类.prototype.constructor.call(this)，做对象调用时指向父类.prototype,从而实现继承。
  




