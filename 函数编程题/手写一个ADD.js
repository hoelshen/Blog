function curry(fn, ...args) {
  return function (...innerArgs) {
    const finalArgs = args.concat(innerArgs);
    if (innerArgs.length === 0) {
      // 空参数时返回结果
      return fn(...finalArgs);
    }
    return curry(fn, ...finalArgs); // 继续收集参数
  };
}

function add(...nums) {
  return nums.reduce((sum, num) => sum + num, 0);
}
let addCurry = curry(add);
console.log(addCurry(1)(2)(3)()); // 6
console.log(addCurry(4)(3)(2)(1)(5)()); // 15

// ## 实现 console.log(add(2,3) === add(2)(3))

function add(n) {
  sum = n;
  const proxy = new Proxy(function a() {}, {
    get(obj, key) {
      return () => sum;
    },
    apply(receiver, ...args) {
      sum += args[1][0];
      return proxy;
    },
  });
  return proxy;
}
console.log(add(1)(2)(3)(10) == 16); // 16
console.log(add(10)(10) === 20); // 20

function add(n) {
  var addNext = function (x) {
    return add(n + x);
  };

  addNext.valueOf = function () {
    return n;
  };

  return addNext;
}
console.log(add(1)(2)(3)(10) == 16); // 16
console.log(add(10)(10)); // 20
