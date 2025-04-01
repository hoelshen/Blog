# ES5和ES6d的区别

## 1. 语法和变量声明
ES5: 只有 var 一种变量声明方式，存在变量提升（hoisting）和作用域不清晰的问题（全局作用域或函数作用域）。
```javascript
var x = 10;
if (true) {
  var x = 20; // 覆盖外层的 x
}
console.log(x); // 输出 20
```
ES6 新增: 引入 let 和 const，支持块级作用域，避免变量提升问题。
```javascript
let x = 10;
if (true) {
  let x = 20; // 块内 x，不会影响外层
}
console.log(x); // 输出 10
const y = 30; // 常量，不可重新赋值
```
2. 箭头函数 (Arrow Functions)
ES5: 使用传统函数表达式。
```javascript
var add = function(a, b) {
  return a + b;
};
```
ES6 新增: 箭头函数，语法更简洁，且 this 绑定到父作用域（词法作用域），不动态绑定。
```javascript
const add = (a, b) => a + b;
```
3. 模板字符串 (Template Literals)
ES5: 字符串拼接使用 +。
```javascript
var name = "Alice";
var greeting = "Hello, " + name + "!";
```
ES6 新增: 模板字符串使用反引号（`），支持多行和表达式嵌入。
```javascript
const name = "Alice";
const greeting = `Hello, ${name}!`;
```
4. 解构赋值 (Destructuring Assignment)
ES5: 手动从对象或数组中提取值。
```javascript
var obj = { a: 1, b: 2 };
var a = obj.a;
var b = obj.b;
```
ES6 新增: 支持对象和数组的解构赋值。
```javascript
const { a, b } = { a: 1, b: 2 };
const [x, y] = [1, 2];
```
5. 默认参数 (Default Parameters)
ES5: 需要在函数体内手动设置默认值。
```javascript
function greet(name) {
  name = name || "Guest";
  return "Hello, " + name;
}
```
ES6 新增: 函数参数可以直接设置默认值。
```javascript
function greet(name = "Guest") {
  return `Hello, ${name}`;
}
```
6. 扩展运算符 (Spread/Rest Operator)
ES5: 操作数组或合并需要用 apply 或循环。
```javascript
var arr1 = [1, 2];
var arr2 = [3, 4];
var combined = arr1.concat(arr2);
```
ES6 新增: 使用 ... 扩展运算符，简洁合并数组或对象，也可以用作剩余参数。
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4]
const sum = (...numbers) => numbers.reduce((a, b) => a + b);
```
7. 类 (Classes)
ES5: 使用构造函数和原型链实现“类”。
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function() {
  return "Hello, " + this.name;
};
```
ES6 新增: 引入 class 语法，更直观地支持面向对象编程。
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  sayHello() {
    return `Hello, ${this.name}`;
  }
}
```
8. 模块 (Modules)
ES5: 没有原生模块系统，依赖 CommonJS 或 AMD。
```javascript
// CommonJS 示例
var module = require("./module");
module.exports = { ... };
```
ES6 新增: 原生支持 import 和 export。
```javascript
// 导出
export const add = (a, b) => a + b;
// 导入
import { add } from "./module.js";
```
9. Promise
ES5: 异步操作依赖回调函数，容易导致“回调地狱”。
```javascript
setTimeout(function() {
  console.log("Step 1");
  setTimeout(function() {
    console.log("Step 2");
  }, 1000);
}, 1000);
```
ES6 新增: 引入 Promise，优雅处理异步。
```javascript
new Promise((resolve) => {
  setTimeout(() => resolve("Step 1"), 1000);
}).then((msg) => {
  console.log(msg);
  return new Promise((resolve) => {
    setTimeout(() => resolve("Step 2"), 1000);
  });
}).then((msg) => console.log(msg));
```
10. 其他重要新增特性

Symbol: ES6 引入的新基本数据类型，用于创建唯一标识符。
```javascript
const sym = Symbol("id");
```

迭代器和生成器 (Iterators & Generators): 增强循环和异步控制。
```javascript
function* generator() {
  yield 1;
  yield 2;
}
```
Map 和 Set: 新增数据结构，支持键值对和唯一值集合。
```javascript
const map = new Map();
map.set("key", "value");
const set = new Set([1, 2, 3]);
```
async/await: ES6 之后的扩展（ES2017），基于 Promise 进一步简化异步代码。
# 总结

ES6 相比 ES5 的主要新增点包括：块级作用域（let/const）、箭头函数、模板字符串、解构赋值、默认参数、扩展运算符、类、模块、Promise 以及更多数据结构和工具。这些特性让 JavaScript 更现代化、更易用，特别适合复杂应用的开发。
如果你需要更深入某个特性或代码示例，可以告诉我哦！