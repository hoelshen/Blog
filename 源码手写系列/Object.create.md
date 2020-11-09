# create

## 实现

```js
const myCreate = function (obj) {
  function F() {};
  F.prototype = obj;
  return new F();
}
```

将参数对象作为一个新创建的空对象的原型， 并返回这个空对象

```JS
Object.create(null) // 生成的空对象在原型对象上也没有任何属性和方法.

var obj = Object.create(null);
obj; // {}
obj.toString(); // Error
obj.valueOf(); // Error
```
