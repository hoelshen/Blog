/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function(x, n) {

  // 每一层能分出来
  if(!n){
    return 1
  }
  // 负
  if(n < 0){
    return 1/ myPow(x, -n)
  }
  if(n%2){
    var result = x * myPow(x, n - 1);
    return result
  }
  
  return myPow(x * x, n/2)
};

// while

var myPow = function(x, n){
  if(n<0){
    x= 1/x;
    n = -n;
  }
  pow = 1;

  while(n){
    if(n & 1){
      pow *=x
    }
    x= x*x;
    n>>=1
  }
  return pow
}

// 可以采用分治的方法

console.log(myPow(2.1, 3))