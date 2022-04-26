#  寻找数组的中心索引

输入：nums = [1, 7, 3, 6, 5, 6]
输出：3
解释：
中心下标是 3 。
左侧数之和 sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11 ，
右侧数之和 sum = nums[4] + nums[5] = 5 + 6 = 11 ，二者相等。

输入：nums = [1, 2, 3]
输出：-1
解释：
数组中不存在满足此条件的中心下标。

输入：nums = [2, 1, -1]
输出：0
解释：
中心下标是 0 。
左侧数之和 sum = 0 ，（下标 0 左侧不存在元素），
右侧数之和 sum = nums[1] + nums[2] = 1 + -1 = 0 。


```js
  // 这题的关键是 先取中心点 两侧加起来
function splitPoint(arr){
  if(arr.length < 0){
    return []
  }
  var point = Math.ceil(arr.length / 2);
  // 二分法
  // 找出向左加起来的值 是不是等于向右加起来的值
  var i = 0 ;
  while(i < point){
    var leftValue = 0;
    var rightValue = 0;
      // DSL
    leftValue += arr[i];
    for(var j = arr.length; i>= point; i--){
      rightValue += arr[j];
      console.log('leftValue', leftValue, rightValue);
      if(leftValue === rightValue){
        return point
      }
    }
  }
  return -1;
}



```