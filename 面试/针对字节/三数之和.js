var threeSum = function(nums) {
  // 排序是双指针算法的前提
  nums = nums.sort((a, b) => a - b);
  const result = [];
  
  // 遍历数组，固定第一个数
  for (let i = 0; i < nums.length - 2; i++) {
    // 如果当前数字大于0，则三数之和一定大于0，所以结束循环
    if (nums[i] > 0) break;
    
    // 去重：如果当前元素与前一个元素相同，跳过本次循环
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    
    // 双指针
    let left = i + 1;
    let right = nums.length - 1;
    
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      
      if (sum < 0) {
        // 和小于0，左指针右移
        left++;
      } else if (sum > 0) {
        // 和大于0，右指针左移
        right--;
      } else {
        // 找到一组解
        result.push([nums[i], nums[left], nums[right]]);
        
        // 去重：跳过重复的元素
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        
        // 继续寻找其他解
        left++;
        right--;
      }
    }
  }
  
  return result;
};