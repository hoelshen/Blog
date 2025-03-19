// ## 两数之和

function twoSum(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left < right) {
      let sum = nums[left] + nums[right];
      if (sum == target) {
        //题目要求索引从1开始的
        return [left + 1, right + 1];
      } else if (sum < target) {
        left++; //让sum大一点
      } else {
        right--; // 让sum小一点
      }
    }
    return [-1, -1];
  }
