/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
  
  var mid = nums.sort((a,b) => a-b)
  var value = Math.floor(mid.length/2)
  return mid[value]
};

console.log(majorityElement([3,2,3]))