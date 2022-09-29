var threeSum = function (nums) {
  // 这种几个数字之和 都是双指针去处理运行
  let target = 0;
  let arr = [];
  nums = nums.sort((a, b) => a - b);
  for (let j = 0; j < nums.length -2; j++) {
    if (nums[j] > target) {
      break;
    }
  }
};
var nums = [-1, 0, 1, 2, -1, -4];
console.log(threeSum(nums));