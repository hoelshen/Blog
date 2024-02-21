/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
  let ans = 0;
  for(const num of nums){
      ans ^=num
  }
  return ans
};

// 异或运算
// 1. 任何数和 0 做异或运算，结果仍然是原来的数
// 2. 任何数和其自身做异或运算，结果是 0
