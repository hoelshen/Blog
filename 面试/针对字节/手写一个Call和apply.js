p
var foo = {
  value: 1
};

function bar() {
  console.log(this.value);
}

bar.call(foo); // 1

// call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。


// call 改变了 this 的指向，指向到 foo
//  bar 函数执行了

function Mycall(context) {
  // 1.this 参数可以传 null，当为 null 的时候，视为指向 window
  context = context ? Object(context) : window;
  context.fn = this;
  context.fn();
  var arg = [];

  for (var i = 1, len = arguments.length; i < len; i++){
    arg.push(arguments[i])
  }
  let = eval(`${context.fn(arg)}`)
  delete context.fn
}

// 将函数设为对象的属性
// 执行该函数
// 删除该函数