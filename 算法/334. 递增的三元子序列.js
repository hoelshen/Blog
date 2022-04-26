334. 递增的三元子序列


示例 1：

输入：nums = [1,2,3,4,5]
输出：true
解释：任何 i < j < k 的三元组都满足题意

示例 2：

输入：nums = [5,4,3,2,1]
输出：false
解释：不存在满足题意的三元组

示例 3：

输入：nums = [2,1,5,0,4,6]
输出：true
解释：三元组 (3, 4, 5) 满足题意，因为 nums[3] == 0 < nums[4] == 4 < nums[5] == 6

/**
 * @param {number[]} nums
 * @return {boolean}
 */

```js
var increasingTriplet = function(nums) {
  // 满足两个点 
  // 1. 下标顺序 递增
  // 2. 下标的值 递增
    let flag = true;
  <!-- for(var i =0; i< nums.length;i++ ){
    while(nums[i]){
      nums[i] = nums[i-1]
      flag = true;
    }
  } -->
  const n = nums.length;
    if (n < 3) {
        return false;
    }
      let first = nums[0], second = Number.MAX_VALUE;
  for (let i = 1; i < n; i++) {
      const num = nums[i];
      if (num > second) {
          return true;
      } else if (num > first) {
          second = num;
      } else {
          first = num;
      }
  }
    return false;
};
```