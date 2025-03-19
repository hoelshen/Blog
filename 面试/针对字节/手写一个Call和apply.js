
// ## Call
function Mycall(context, ...args) {
  if (typeof this !== 'function') {
    throw new Error("Function.prototype.call - what is trying to be bound is not callable");
  }
  // 如果 context 为 null或 undefined，则指向全局对象
  context = context || window;
  // 创建一个唯一的属性名，避免覆盖原有属性
  const fnSymbol = Symbol();
  // 将当前函数赋值给 context 的临时属性
  context[fnSymbol] = this;
  
  // 执行函数并传入参数
  const  result = context[fnSymbol](...args);

  // 删除临时属性
  delete context[fnSymbol];

  // 返回执行结果
  return result
}

// ## Apply
function MyApply(context, args) {
  if (typeof this !== 'function') {
    throw new Error("Function.prototype.call - what is trying to be bound is not callable");
  }
  
  context = context || window;
  
  const fnSymbol = Symbol();

  context[fnSymbol] = this;

  const result  = args ? context[fnSymbol](...args) : context[fnSymbol]();

  delete context[fnSymbol];

  return result;
}