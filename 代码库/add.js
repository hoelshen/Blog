function add() {
  // 拆成三部分
  let args = [].slice.call(arguments);
  // 拼接多个参数
  let fn = function(){
   let fn_args = [].slice.call(arguments)
   return add.apply(null,args.concat(fn_args))
  }
  // 连续调用
  fn.toString = function(){
    return args.reduce((a,b)=>a+b)
  }
  return fn
}



引用类型转换为基本类型(所有的引用类型转换为布尔值都是true)

引用类型转换为字符串

1.优先调用toString方法（如果有），看其返回结果是否是原始类型，如果是，转化为字符串，返回。
2.否则，调用valueOf方法（如果有），看其返回结果是否是原始类型，如果是，转化为字符串，返回。
3.其他报错。

引用类型转化为数字

1.优先调用valueOf方法（如果有），看其返回结果是否是原始类型，如果是，转化为数字，返回。
2.否则，调用toString方法（如果有），看其返回结果是否是原始类型，如果是，转化为数字，返回。
3.其他报错。
