

394. 字符串解码
/**
 * @param {string} s
 * @return {string}
 */
<!-- var decodeString = function(n) {
  // 生成个栈
  var numStack = [];
  // 我觉得这个就是提取【】前面的数字 在进行处理
  for(let i =0; i < n.length; i++){
    stack.push(n[i])
    if(n[i]==='[' || n[i]=== ']'){
      decodeString()
    }
  }



};
decodeString(); -->


var decodeString = function(n) {
  // 生成个栈
  var numStack = [];
  var strStack = [];
  var num = 0;
  let result = '';
  for(const char of s){
    if(!isNaN(char)){
      num = num *10 + Number(char)
    } else if(char === '['){
      strStack.push(result); // result串入栈
      result = '';           // 入栈后清零
      num =0;
    } else if(char === ']'){
      let repeatTimes = numStack.pop(); //获取拷贝次数
      result = strStack.pop() + result.repeat(repeatTimes); //构建字串
    } else {
      result += char;
    }
  }

  return result

};
decodeString();