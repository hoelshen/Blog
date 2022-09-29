const _add = (a, b) => a+b;
  //运用闭包的原理 和 curry化 表达式
const curry = (fn, ...arg) =>{
  return arg.length >= fn.lenght ? fn(...arg) : (..._arg) => curry(fn, ..._arg);
}
const add = curry(_add);
const value =add(1)(2);
console.log(value, 1)
// 中阶：
// const _add = (a,b)=>a+b;

// const curry = (fn, ...arg)=>{
//   return arg.length >= fn.length ?
//     fn(...arg):
//   (..._arg) => curry(fn, ...arg, ..._arg);
// }
// const add=curry(_add)
// function curry() {
//   // 拆成三部分
//   let args = [].slice.call(arguments);
//   // 拼接多个参数
//   let fn = function () {
//     let fn_args = [].slice.call(arguments);
//     return add.apply(null, args.concat(fn_args));
//   };
//   // 连续调用
//   fn.toString = function () {
//     return args.reduce((a, b) => a + b);
//   };
//   return fn;
// }
// const _add = (a, b) => a + b;
// const add = curry(_add, 1, 2, 3);
// console.log(add);

// function currying(fn, ...args) {
//   // fn.length 回调函数的参数的总和
//   // args.length currying函数 后面的参数总和
//   // 如：add (a,b,c,d)  currying(add,1,2,3,4)
//   if (fn.length === args.length) {
//     return fn(...args);
//   } else {
//     // 继续分步传递参数 newArgs 新一次传递的参数
//     return function anonymous(...newArgs) {
//       // 将先传递的参数和后传递的参数 结合在一起
//       let allArgs = [...args, ...newArgs];
//       return currying(fn, ...allArgs);
//     };
//   }
// }

// let fn1 = currying(_add);
// let value = fn1(1)(2)(3); // 3
// // let fn2 = fn1(3)  // 6
// // let fn3 = fn2(4)  // 10
// console.log("xxx", value);

// ## 实现 console.log(add(2,3) === add(2)(3))

// function add(a, b) {
//   return a + b;
// }
