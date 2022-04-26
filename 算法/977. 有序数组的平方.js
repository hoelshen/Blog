给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。

977. 有序数组的平方
示例 1：

输入：nums = [-4,-1,0,3,10]
输出：[0,1,9,16,100]
解释：平方后，数组变为 [16,1,0,9,100]
排序后，数组变为 [0,1,9,16,100]
示例 2：

输入：nums = [-7,-3,2,3,11]
输出：[4,9,9,49,121]

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function(nums) {
  console.log('nums', nums);
  // 先处理成 计算出平方
  const doubleNums = nums.map(num => num * num);
  console.log('doubleNums', doubleNums);
  // 接着处理平方的排序
  return doubleNums.sort((a,b)=>{return a-b})
};

sortedSquares([-7,-3,2,3,11]);
