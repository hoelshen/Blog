/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  var len = prices.length
  var val = 0;

  //迭代循环  把每个值求出 他们后一位  后两位 后 n 位的大小
  for (let n = 0; n < len; n++){
    for(let j = n+1; j < len; j++){

      if(prices[n] < prices[j]){
        console.log('prices[n] < prices[j]: ', prices[n] , prices[j]);
        var val1 = prices[j] - prices[n]

        val = val1 > val ? val1 : val
      } else{
        // console.log('prices[n] > prices[j]: ', prices[n] , prices[j]);

        val1 = 0
      }
    }
  }
  return val1 > val ? val1 : val
};

// var num = [7, 1, 5, 3, 6, 4];
var num = [5,3,6,7,11,1,12]
// var num = [7,6,4,3,1]
var val = maxProfit(num);
console.log('val: ', val);