// 编写一个sum函数，实现如下功能：

// function sum(a) {
//   return function (b) {
//     return function (c) {
//       return a + b + c;
//     };
//   };
// }
var add = function (num1, num2) {
  return num1 + num2;
};
// // 如果我们预先知道要传多少个数字
// var curry = function (add, n) {
//   let i = 0;
//   let arr = [];
//   return function reply(arg) {
//     arr.push(arg);
//     if (++i >= n) {
//       return arr.reduce(function (p, c) {
//         return (p = add(p, c));
//       }, 0);
//     } else {
//       return reply;
//     }
//   };
// };

// var sum = curry(add, 4);

// // console.log(sum(4)(3)(2)(1)); // 6.

// function curry(add) {
//   var arr = [];

//   return function reply() {
//     var arg = Array.prototype.slice.call(arguments);
//     arr = arr.concat(arg);

//     if (arg.length === 0) {
//       // 递归结束条件，修改为 传入空参数
//       return arr.reduce(function (p, c) {
//         return (p = add(p, c));
//       }, 0);
//     } else {
//       return reply;
//     }
//   };
// }

// console.log(sum(4)(3)(2)(1)(5)()); // 15

//
function curry(fn) {
  var args = Array.prototype.slice.call(arguments);
  console.log("args: ", args);
  return function () {
    var innerArgs = Array.prototype.slice.call(arguments);
    console.log("innerArgs: ", innerArgs);
    var finalArgs = args.concat(innerArgs);
    return fn.apply(null, finalArgs);
  };
}

function add(num1, num2) {
  return num1 + num2;
}
var curriedAdd = curry(add, 5);

var curriedAdd2 = curry(add, 5, 12);

console.log(curriedAdd(3)); // 8
console.log(curriedAdd2()); // 17
let addCurry = curry(add);
console.log(addCurry(1)(2)(3));
// console.log(sum(4)(3)(2)(1)(5)()); // 15
