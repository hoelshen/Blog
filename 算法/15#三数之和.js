//  三数之和
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
  let ans = [];
  const len = nums.length;
  if(nums == null || len < 3) return ans;
  nums.sort((a, b) => a - b); // 排序
  for (let i = 0; i < len ; i++) {
      if(nums[i] > 0) break; // 如果当前数字大于0，则三数之和一定大于0，所以结束循环
      if(i > 0 && nums[i] == nums[i-1]) continue; // 去重
      let L = i+1;
      let R = len-1;
      while(L < R){
          const sum = nums[i] + nums[L] + nums[R];
          if(sum == 0){
              ans.push([nums[i],nums[L],nums[R]]);
              while (L<R && nums[L] == nums[L+1]) L++; // 去重
              while (L<R && nums[R] == nums[R-1]) R--; // 去重
              L++;
              R--;
          }
          else if (sum < 0) L++;
          else if (sum > 0) R--;
      }
  }        
  return ans;
};


// var threeSum = function(nums) {
//   nums=nums.sort(function(a,b){return a-b});//先排序
//   console.log('nums: ', nums);
//   console.log('nums: ', nums.length);
//   var i=0;
//   var arr=[];
//   while(i<nums.length-1){
//     var a=nums[i],j=i+1,k=nums.length-1;
//     while(j<k){
//       var b=nums[j],c=nums[k];
//       var sum=a+b+c;
//       if(sum==0)arr.push([a,b,c]);//存起来
//       if(sum<=0)
//         while(nums[j]==b&&j<k)j++;//第2个数
//       if(sum>=0)
//         while(nums[k]==c&&j<k)k--//最后一个数
//     }
//     while(nums[i]==a&&i<nums.length-1)i++;//第一个数
//   }
//   return arr
// };

var nums = [-1, 0, 1, 2, -1, -4];
var val = threeSum(nums);
console.log("val: ", val);


