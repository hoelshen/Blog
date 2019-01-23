# 本文解决痛点：对象里面是否有值。

## 1.通过  JSON  自带的  stringify()  方法来判断:

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

## 3.ES6  新增的方法  Object.keys():

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
