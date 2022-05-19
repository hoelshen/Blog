function minWindow(s, t) {
  var needs = {}; // 需要凑齐的字符
  var window = {}; //窗口中字符
  for (let a of t) {
    //统计需要的字符
    needs[a] = (needs[a] || 0) + 1;
  }
  var left = 0;
  (right = 0), (valid = 0);
  // 最小覆盖子串的起始索引及长度
  var start = 0,
    min = Number.MAX_VALUE;
  while (right < s.length) {
    // 即将移入窗口的字符
    var c = s[right];
    // 其中valid变量表示窗口中满足needs条件的字符个数，如果valid和needs.length的大小相同，则说明窗口以满足条件，已经完全覆盖子串
    right++;
    if (needs[c]) {
      // 当前字符在需要的字符中，则更新当前窗口统计
      window[c] = (window[c] || 0) + 1;
      if (window[c] == needs[c]) {
        // 当前窗口和需要的字符匹配时，验证数量增加1
        valid++;
      }
    }
    // 判断左侧窗口是否要收缩，当验证数量与需要的字符个数一直时，就应该收缩窗口了
    while (valid == Object.keys(needs).length) {
      // 更新最小覆盖子串
      if (right - left < min) {
        start = left;
        min = right - left;
      }
      // d是将移出窗口的字符
      var d = s[left];
      left++;
      //进行窗口内数据的一系列更新
      if (needs[d]) {
        if (window[d] == needs[d]) {
          valid--;
        }
        window[d]--;
      }
    }
  }
  //返回最小覆盖子串
  return min == Number.MAX_VALUE ? "" : s.substr(start, min);
}
