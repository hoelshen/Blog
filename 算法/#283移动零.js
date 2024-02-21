/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
  const len = nums.length;
  for(let i = 0 ; i < len; i++){
      if(nums[i] === 0){
          // 移动到数组的末尾
          nums.splice(i, 1);
          nums.push(0);
      }
  }
};