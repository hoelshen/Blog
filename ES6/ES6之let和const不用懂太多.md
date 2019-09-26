# let 和 const 命令不用懂太多

## 命令是个啥

变量作用域的基本单元是function，创建一个块作用域



## var
局部 JavaScript 变量
在 JavaScript 函数内部声明的变量（使用 var）是局部变量，所以只能在函数内部访问它。（该变量的作用域是局部的）。
您可以在不同的函数中使用名称相同的局部变量，因为只有声明过该变量的函数才能识别出该变量。

##let  声明
var 声明的变量总是归属于包含函数（即全局，如果在最顶层的话）

过早访问 let 声明的引用导致的这个referenceerror 叫做临时死亡区错误

你在访问一个已经声明但还没有初始化的变量  ？？？

const 是对赋值做锁定  不对值的改变锁定  例如：数组 对象

格式化后
var x = 10,
  y = 20;
[y, x] = [x, y]
console.log(x, y)
![](http://pvt7l4h05.bkt.clouddn.com/2019-09-03-Pasted%20Graphic%20110.tiff)


![](http://pvt7l4h05.bkt.clouddn.com/2019-09-03-IMG_1063.png)

Let变量的声明
Const对常量的声明
命令
Let 在{只在代码块有效}

![](http://pvt7l4h05.bkt.clouddn.com/2019-09-03-Pasted%20Graphic%2019.tiff)

## const

值 vs. 引用
对于基本类型的值，赋值是通过值拷贝的形式；比如：null，undefined，boolean，number，string和ES6的symbol。对于复杂类型的值，通过引用拷贝的形式赋值。比如：对象、对象包括数组和函数。
var a = 2;        // 'a' hold a copy of the value 2.
var b = a;        // 'b' is always a copy of the value in 'a'
b++;
console.log(a);   // 2
console.log(b);   // 3
var c = [1,2,3];
var d = c;        // 'd' is a reference to the shared value
d.push( 4 );      // Mutates the referenced value (object)
console.log(c);   // [1,2,3,4]
console.log(d);   // [1,2,3,4]
/* Compound values are equal by reference */
var e = [1,2,3,4];
console.log(c === d);  // true
console.log(c === e);  // false
如果想对复杂类型的值进行值拷贝，你需要自己去对所有子元素进行拷贝。
const copy = c.slice()    // 'copy' 即使copy和c相同，但是copy指向新的值
console.log(c);           // [1,2,3,4]
console.log(copy);        // [1,2,3,4]
console.log(c === copy);  // false
作用域(Scope)
作用域值程序的执行环境，它包含了在当前位置可访问的变量和函数。
全局作用域是最外层的作用域，在函数外面定义的变量属于全局作用域，可以被任何其他子作用域访问。在浏览器中，window对象就是全局作用域。
局部作用域是在函数内部的作用域。在局部作用域定义的变量只能在该作用域以及其子作用域被访问。
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

outer();
你可以将作用域想象成一系列不断变小的门。如果一个个子不高的人可以穿过最小的门(局部最小作用域)，那么必然可以穿过任何比它大的门(外部作用域)。
提升(Hoisting)
在编译过程中，将var和function的定义移动到他们作用域最前面的行为叫做提升。
整个函数定义会被提升。所以，你可以在函数还未定义之前调用它，而不用担心找不到该函数。
console.log(toSquare(3));  // 9

function toSquare(n){
  return n*n;
}
变量只会被部分提升。而且只有变量的声明会被提升，赋值不会动。



let和const不会被提升。
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


变量：var，let和const
在ES6之前，只能使用var来声明变量。在一个函数体中声明的变量和函数，周围的作用域内无法访问。在块作用域if和for中声明的变量，可以在if和for的外部被访问。
注意：如果没有使用var,let或则const关键字声明的变量将会绑定到全局作用域上。
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
ES6的let和const都是新引入的关键字。它们不会被提升，而且是块作用域。也就是说被大括号包围起来的区域声明的变量外部将不可访问。
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
一个常见的误解是：使用const声明的变量，其值不可更改。准确地说它不可以被重新赋值，但是可以更改。
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



