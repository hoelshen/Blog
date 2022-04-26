// 349. 两数交集
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
  console.log('nums1, nums2: ', nums1, nums2);
  // 构建个栈
  let result = [];
  // 如果nums2存在同样的树，则放入result数组中
  for (let i = 0; i < nums1.length; i++) {
    if (nums2.indexOf(nums1[i]) !== -1) {
      result.push(nums1[i]);
    }
  }
  return Array.from(new Set(result));
};
var nums1 = [1,2,2,1], nums2 = [2,2]
console.log(intersection(nums1, nums2));