35. 搜索插入位置

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    var len = nums.length;
    var mid = Math.floor(len/2);
    // 二分法减少
    for(var i =0; i< mid; i++){
        if(target == nums[i]){
            return i
        }
    }
    for(var j = mid; j < len; j++){
        if(target == nums[j]) {
            return j
        }
    }
};
searchInsert([1,3,5,6], 5);


// 存在题干

其中 
nums
nums 代表排序数组。由于如果存在这个目标值，我们返回的索引也是 
pos
pos，因此我们可以将两个条件合并得出最后的目标：「在一个有序数组中找第一个大于等于 
target
target 的下标」。

var searchInsert = function(nums, target) {
  const n = nums.length;
  let left = 0, right = n-1; ans = n;
  while(left <=right){
    let mid = ((right - left) >> 1) + left;
    if(target <= nums[mid]){
      ans = mid;
      right = mid -1;
    } else {
      left = mid + 1;
    }
  }
  return ans;
}
