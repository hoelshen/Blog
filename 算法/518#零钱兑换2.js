// 给你一个整数数组 coins 表示不同面额的硬币，另给一个整数 amount 表示总金额。

// 请你计算并返回可以凑成总金额的硬币组合数。如果任何硬币组合都无法凑出总金额，返回 0 。

// 假设每一种面额的硬币有无限个。 

// 题目数据保证结果符合 32 位带符号整数。


/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
// var change = function(amount, coins){
//   let dp = function(num) {
//     // 确定base case
//     if(num === 0){
//       return 1;
//     }
//     if(num < 1) {
//       return -1;
//     }
//     let res = 0;

//     for(coin of coins) {
//       // 确定状态
//       let temp = dp(num - coin);
//       if(temp === -1) continue;
//       //确定选择
//       res += temp;
//     }
//     return res;
//   }
//   return dp(amount);
// }

var change = function(amount, coins) {
    let dp = new Array(amount + 1).fill(0);
    dp[0] = 1;
    for (let coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] += dp[i - coin];
        }
    }
    return dp[amount];
};
var amount = 5, coins = [1, 2, 5];
// var amount = 10, coins = [10] ;
// var amount = 3, coins = [2];
console.log(change(amount, coins));
// 这种感觉也可以用动态规划来做，但是这里的状态转移方程是：

// 如果求组合数就是外层for循环遍历物品，内层for遍历背包。

// 如果求排列数就是外层for遍历背包，内层for循环遍历物品。


