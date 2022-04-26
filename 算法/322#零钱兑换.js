/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
  const dp = new Array(amount+1).fill(Infinity);
  dp[0] = 0;
  for(let i = 0; i <= amount; i++){
    for(let coin of coins){
      if(i - coin >= 0){
        dp[i] = Math.min(dp[i], dp[i - coin] + 1)
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount]
};


var coins = [1, 2, 5], amount = 11;
console.log(coinChange(coins, amount))


解法解析

假设就有三个coin,凑一个11啦~

dp(11)的选择方法:

选择1: dp[11] = 一个1 + 剩余需要凑出的dp[11 - 1]的最优解
选择2: dp[11] = 一个2 + 剩余需要凑出的dp[11 - 2]的最优解
选择5: dp[11] = 一个5 + 剩余需要凑出的dp[11 - 5]的最优解
















































