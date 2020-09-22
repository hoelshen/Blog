
// js  使用 > 运算符 比较两个字符串大小时, 会把字符串转换成 ascii 码进行一次比较
```js
var a = "1.2.2a";
var b = "1.2.2b";
console.log(a > b， a < b); // 输出 false true
 
a = "1.02.1";
b = "1.1";
console.log(a > b,a < b); // 输出 false true

```
// 比较标准时间格式可以直接使用 ' > ' 比较； (2018-07-20格式)