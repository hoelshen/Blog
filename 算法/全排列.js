

// 主函数，输入一组不重复的数字，返回它们的全排列
function permutation(arr) {
    var result = [];
    if (arr.length === 0) {
        return result;
    }
    var temp = [];
    backtrack(arr, temp, result);
    return result;
}
// 全排列的核心函数

// 路径：记录track中
// 选择列表： nums中不存在于track'的那些元素
// 结束条件： nums 中的元素全都在track中出现
function backtrack(nums, track, result) {
  // 触发结束条件
  if(track.length === nums.length){
    result.push(track);
    return;
  }

  for( let i = 0; i <nums.length; i++){
    // 排除不合法的选择
    if(track.indexOf(nums[i]) !== -1) continue;
    // 做选择
    track.push(nums[i]);
    // 进入下一层决策树
    backtrack(nums, track);
    // 取消选择
    track.pop();
  }
};