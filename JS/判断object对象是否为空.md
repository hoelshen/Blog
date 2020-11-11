# 本文解决痛点：对象里面是否有值

## 1.通过  JSON  自带的  stringify()  方法来判断

JSON.stringify()  方法用于将  JavaScript  值转换为  JSON  字符串。

```javascirpt
if (JSON.stringify(data) === '{}') {
    return false // 如果为空,返回false
}
return true // 如果不为空，则会执行到这一步，返回true
```

这里需要注意为什么不用  toString()，因为它返回的不是我们需要的。

```javascirpt
var a = {}
a.toString() // "[object Object]"
```

## 2.for...in...  遍历属性，为真则为“非空数组”；否则为“空数组”

```javascirpt
for (var i in obj) { // 如果不为空，则会执行到这一步，返回true
    return true
}
return false // 如果为空,返回false

```

## 3.ES6  新增的方法  Object.keys()

Object.keys()  方法会返回一个由给定对象的自身可枚举属性组成的数组。
如果我们的对象为空，他会返回一个空数组，如下：

```javascirpt
var a = {}
Object.keys(a) // []
```

```javascirpt
if (Object.keys(object).length === 0) {
    return false // 如果为空,返回false
}
return true // 如果不为空，则会执行到这一步，返回true

```

#### 之后会写一些 js 常用的技巧，原理链和容易混淆的概念，希望能帮助到一些人。由于能力有限，可能理解有误，欢迎指出。


## 拆箱和装箱


## typeof

对于基本类型, 除 null 以外, 均可以返回正确的结果.
对于引用类型, 除 function 以外, 一律返回 object 类型.
对于 null, 返回 object 类型
对于 function, 返回 function 类型

其中，null 有属于自己的数据类型 Null ， 引用类型中的 数组、日期、正则 也都有属于自己的具体类型，而 typeof 对于这些类型的处理，只返回了处于其原型链最顶端的 Object 类型，没有错，但不是我们想要的结果。

所谓的装箱，是指将基本数据类型转换为对应的引用类型的操作。而装箱又分为隐式装箱和显式装箱。

隐式装箱当读取一个基本类型值时，后台会创建一个该基本类型所对应的基本包装类型对象。

隐式装箱当读取一个基本类型值时，后台会创建一个该基本类型所对应的基本包装类型对象。






