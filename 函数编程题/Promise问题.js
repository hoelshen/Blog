console.log("1");
async function async1() {
  console.log("2");
  await async2();
  console.log("3");
}
async function async2() {
  console.log("4");
}
setTimeout(function () {
  console.log("5");
  new Promise(function (resolve) {
    console.log("6");
    resolve();
  }).then(function () {
    console.log("7");
  });
});
async1();
new Promise(function (resolve) {
  console.log("8");
  resolve();
}).then(function () {
  console.log("9");
});
console.log("10");

1
2
4
8
10
3
9
5
6
7

//
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(function () {
  console.log('setTimeout');
},0)
async1();
new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end');

-------------------------------

console.log('script start');
console.log('async1 start');
console.log('async2');
console.log('async1 end');
console.log('script end');   xxxx这一步错了 promise1 算是同步的因为他是在 new 阶段是同步的
console.log('promise1');
console.log('promise2');
console.log('setTimeout');
console.log('promise2');
