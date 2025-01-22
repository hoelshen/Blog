两种错误认识

1. this 指向自身

this 的指向在函数定义阶段是无法确定的，只有函数执行时才能确定 this 到底指向谁，实际 this 的最终指向是调用它的那个对象。

```js
function foo(num) {
  this.count++; // 记录 foo 被调用次数
}
foo.count = 0;
window.count = 0;
for (let i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
console.log(foo.count, window.count); // 0 4
```

2. this 指向函数作用域

```js
function foo() {
  var a = 2;
  this.bar();
}
function bar() {
  console.log(this.a);
}
foo(); // undefined
bar(); // undefined
```

- 浏览器：在浏览器环境里是没有问题的，全局声明的函数放在了 window 对象下，foo 函数里面的 this 代指的是 window 对象，在全局环境中并没有声明变量 a，因此在 bar 函数中的 this.a 自然没有定义，输出 undefined。

- Node.js：在 Node.js 环境下，声明的 function 不会放在 global 全局对象下，因此在 foo 函数里调用 this.bar 函数会报 TypeError: this.bar is not a function 错误。要想运行不报错，调用 bar 函数时省去前面的 this。

## This 四种绑定规则

1. 默认绑定

当函数调用属于独立调用，无法调用其他规则时，我们给它一个称呼“默认绑定”。

```js
function demo() {
  console.log(this.a); // 1
}
var a = 1;
demo();
```

非严格模式下调用， 浏览器会将 a 绑定到 window.a，以下代码使用 var 声明的变量 a 会输出 1.

以下代码使用 let 或 const 声明变量 a 结果会输出 undefined

```js
function demo() {
  console.log(this.a); // undefined
}
let a = 1;
demo();
```

在举例子的时候其实想要重点说明 this 的默认绑定关系的，但是你会发现上面两种代码因为分别使用了 var、let 进行声明导致的结果也是不一样的，归其原因涉及到 顶层对象的概念

顶层对象（浏览器环境指 window、Node.js 环境指 Global）的属性和全局变量属性的赋值是相等价的，使用 var 和 function 声明的是顶层对象的属性，而 let 就属于 ES6 规范了，但是 ES6 规范中 let、const、class 这些声明的全局变量，不再属于顶层对象的属性。

2. 隐式绑定

在函数的调用位置处被某个对象包含，拥有上下文，看以下示例：

```js
function child() {
  console.log(this.name);
}
let parent = {
  name: "zhangsan",
  child,
};
parent.child(); // zhangsan
```

函数在调用时会使用 parent 对象上下文来引用函数 child，可以理解为 child 函数被调用时 parent 对象拥有或包含它。

3. 显示绑定

使用 call、apply、bind 方法可以改变 this 的指向，看以下示例：

```js
function test(...arg) {
  console.log(this.variable + arg);
}

var obj = {
  variable: 1,
};

test();

test.apply(obj, [2, 2, 3]);
test.call(obj, 2);
var c = test.bind(obj, 3);
c();
```

把 obj 绑定到 thisObj,这时 thisObj 就具备了 obj 的属性和方法。

与 call 和 apply 不同的是，bind 绑定之后返回绑定完成的函数， 不会立即执行，需要再显式执行一次此函数才能完成调用。

4. new 绑定

new 绑定也可以影响 this 调用，它是一个构造函数，每一次 new 绑定都会创建一个新对象。

```js
function Fruit(name) {
  this.name = name;
}

const f1 = new Fruit("apple");
const f2 = new Fruit("banana");
console.log(f1.name, f2.name); // apple banana
```

优先级

如果 this 的调用位置同时应用了多种绑定规则，它是有优先级的：new 绑定 -> 显示绑定 -> 隐式绑定 -> 默认绑定。

箭头函数

箭头函数并非使用 function 关键字进行定义，也不会使用上面所讲解的 this 四种标准规范，箭头函数会继承自外层函数调用的 this 绑定。

```js
function fruit() {
  return () => {
    console.log(this.name);
  };
}
var apple = {
  name: "苹果",
};
var banana = {
  name: "香蕉",
};
var fruitCall = fruit.call(apple);
fruitCall.call(banana); // 苹果
```

## This 指向问题遇到的坑

1. 原型链上使用箭头函数

```js
function Fruit(name) {
  this.name = name;
}
Fruit.prototype.info = () => {
  console.log(this.name);
};
var name = "Banana";
const f1 = new Fruit("Apple");
f1.info(); // Banana
```

2. 通过函数和原型链模拟类

```js
function Fruit(name) {
  this.name = name;
}
Fruit.prototype.info = function () {
  console.log(this.name);
};
var name = "Banana";
const f1 = new Fruit("Apple");
f1.info(); // Apple
```
