/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  const map = {};
  var left = 0;

  return s.split("").reduce((max, v, i) => {
    left = map[v] >= left ? map[v] + 1 : left;
    map[v] = i;
    return Math.max(max, i - left + 1);
  }, 0);
};

function lengthOfLongestSubstring(s) {
  var window = {};
  var left = 0,
    right = 0;
  var res = 0; //记录结果
  while (right < s.length) {
    var c = s[right];
    right++;
    // 进行窗口内数据的一系列更新
    window[c] = (window[c] || 0) + 1;
    // 判断左侧窗口是否要收缩
    while (window[c] > 1) {
      var d = s[left];
      console.log("d", d);
      left++;
      // 进行窗口内数据的一系列更
      // 收起左侧的窗口,并对窗口值进行跟新
      window[d]--;
      console.log("window[d]", window[d]);
    }
    // 在这里更新答案
    res = Math.max(res, right - left);
  }
  return res;
}
