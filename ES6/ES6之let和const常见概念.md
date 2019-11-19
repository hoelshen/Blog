# let 和 const 声明常见概念

## 作用域(Scope)是什么

作用域是程序的执行环境，它包含了在当前位置可访问的变量和函数。在 ES5 时代，我们有全局作用域和局部作用域，ES6 则新增了块级作用域。
全局作用域是最外层的作用域，在函数外面定义的变量属于全局作用域，可以被任何其他子作用域访问。在浏览器中，window 对象就是全局作用域。
局部作用域的基本单元是 function。局部作用域是在函数内部的作用域。在局部作用域定义的变量只能在该作用域以及其子作用域被访问。
var、const、let 则是关键字，我们将这三个关键字作为作用域的声明变量。

## var 声明

局部 JavaScript 变量
 var 声明的变量总是归属于包含函数（即全局，如果在最顶层的话）。在 JavaScript 函数内部声明的变量（使用 var）是局部变量，所以只能在函数内部访问它。（该变量的作用域是局部的）。您可以在不同的函数中使用名称相同的局部变量，因为只有声明过该变量的函数才能识别出该变量。

提升(Hoisting)
在编译过程中，将var和function的定义移动到他们作用域最前面的行为叫做提升。
整个函数定义会被提升。所以，你可以在函数还未定义之前调用它，而不用担心找不到该函数。

```js
console.log(toSquare(3));  // 9

function toSquare(n){
  return n*n;
}
```

变量只会被部分提升。而且只有变量的声明会被提升，赋值不会动。

开发者可能最希望实现 for 循环的块级作用域了，因为可以把随意申明的计数器变量限制在循环内部。

```js
  for(var i = 0; i< 10; i++>){
    console.log(i)
  }
```

立即执行函数能够有效解决：

```js
for(var i = 0; i< 10; ++i){
  (function(value){
     console.log(value)
  }(i))
}
```

还有一个例子:

```js
    (function() {
      var testValue = 'hello';
      var testFunc = function () {
        console.log('just test'); };
    })();

    console.log(window.testValue);// undefined

    console.log(window.testFunc);// undefined
```

趣题:

```js
var x = 10,
  y = 20;
[y, x] = [x, y]
console.log(x, y)
```

## let 与 const 声明

ES6 的 let 和 const 都是新引入的关键字。它们不会被提升，而且是块作用域。也就是说被大括号包围起来的区域声明的变量外部将不可访问。

### let 声明

过早访问 let 声明的引用导致的这个 referenceerror 叫做临时死亡区错误.你在访问一个已经声明但还没有初始化的变量. 创建一个块作用域.

```js
let g1 = 'global 1'
let g2 = 'global 2'
{   /* Creating a new block scope */
  g1 = 'new global 1'
  let g2 = 'local global 2'
  console.log(g1)   // 'new global 1'
  console.log(g2)   // 'local global 2'
  console.log(g3)   // ReferenceError: g3 is not defined
  let g3 = 'I am not hoisted';
}
console.log(g1)    // 'new global 1'
console.log(g2)    // 'global 2'
```

### const 声明

const 是对赋值做锁定，不对值的改变锁定。例如：数组、对象。
一个常见的误解是：使用const声明的变量，其值不可更改。准确地说它不可以被重新赋值，但是可以更改。

```js
  const tryMe = 'initial assignment';
  tryMe = 'this has been reassigned';  // TypeError: Assignment to constant variable.
  // You cannot reassign but you can change it…
  const array = ['Ted', 'is', 'awesome!'];
  array[0] = 'Barney';
  array[3] = 'Suit up!';
  console.log(array);     // [“Barney”, “is”, “awesome!”, “Suit up!”]
  const airplane = {};
  airplane.wings = 2;
  airplane.passengers = 200;
  console.log(airplane);   // {passengers: 200, wings: 2}
```

### 常见例子

```js
function outer() {
  let a = 1;
  function inner() {
    let b = 2;
    function innermost() {
      let c = 3;
      console.log(a, b, c);   // 1 2 3
    }
    innermost();
    console.log(a, b);        // 1 2 — 'c' is not defined
  }
  inner();
  console.log(a);             // 1 — 'b' and 'c' are not defined
}
```

outer();
你可以将作用域想象成一系列不断变小的门。如果一个个子不高的人可以穿过最小的门(局部最小作用域)，那么必然可以穿过任何比它大的门(外部作用域)。

let和const不会被提升。

以下是一些常见的题目：

```js

{  /* Original code */
  console.log(i);  // undefined
  var i = 10
  console.log(i);  // 10
}

{  /* Compilation phase */
  var i;
  console.log(i);  // undefined
  i = 10
  console.log(i);  // 10
}
// ES6 let & const
{
  console.log(i);  // ReferenceError: i is not defined
  const i = 10
  console.log(i);  // 10
}
{
  console.log(i);  // ReferenceError: i is not defined
  let i = 10
  console.log(i);  // 10
}
```

变量：var，let和const
在ES6之前，只能使用var来声明变量。在一个函数体中声明的变量和函数，周围的作用域内无法访问。在块作用域if和for中声明的变量，可以在if和for的外部被访问。
注意：如果没有使用 var,let 或者 const 关键字声明的变量将会绑定到全局作用域上。

```js
function greeting() {
  console.log(s) // undefined
  if(true) {
    var s = 'Hi';
    undeclaredVar = 'I am automatically created in global scope';
  }
  console.log(s) // 'Hi'
}
console.log(s);  // Error — ReferenceError: s is not defined
greeting();
console.log(undeclaredVar) // 'I am automatically created in global scope'
```

```js
let a = 2;

if(a> 1){
  let b = a +1;
  console.log(b)  //6

  for(let i = a; i <=b;i ++){
    let j = i +10;
    console.log(j)
  }
  //12 13 14 15 16

  let c = a+ b;
  console.log('c: ', c);
}
```

## 总结

  默认使用 const， 只在确实需要改变的时候使用 let, 这样就可以在某种程度上实现代码的不可变。从而防止某些错误的产生。
