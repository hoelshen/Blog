// 46.全排列
// 主函数，输入一组不重复的数字，返回它们的全排列
// 全排列的核心函数
// 路径：记录track中
// 选择列表： nums中不存在于track'的那些元素
// 结束条件： nums 中的元素全都在track中出现
// 正确的方式
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  const res = [],
    track = [];
  backtracking(nums, nums.length, []);
  return res;

  function backtracking(n, k, used) {
    // 触发结束条件
    if (track.length === k) {
      res.push(Array.from(track));
      return;
    }
    for (let i = 0; i < k; i++) {
      // 排除不合法的选择
      if (used[i]) continue;
      // 做选择
      track.push(n[i]);
      used[i] = true; // 同支
      // 进入下一层决策树
      backtracking(n, k, used);
      // 取消选择
      track.pop();
      used[i] = false;
    }
  }
};
