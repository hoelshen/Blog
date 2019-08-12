

```js
function  test(...arg){
    console.log(this.variable + arg)
}

var obj = {
    variable :1
}

test();

test.apply(obj,[2,2,3])
test.call(obj,2)
var c = test.bind(obj,3);
c();

//把obj绑定到thisObj,这时thisObj就具备了obj的属性和方法。 
// 与call和apply不同的是，bind绑定之后返回绑定完成的函数， 不会立即执行，需要再显式执行一次此函数才能完成调用。
```


// es7已经淘汰了bind的写法 ，而使用::  ：：obj.method

//object 有如下语法

//delegat 可以将一个对象的方法、属性等委托给另一个对象。
//koa的上下文对象ctx可以访问一些request和response上的方法、属性，原因在于，request或者response上的方法、属性被委托给了ctx对象


// 先获得delegate引用对象


