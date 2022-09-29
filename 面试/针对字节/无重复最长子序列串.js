function lengthOfLongestSubstring(s){
//无重复最长子序号  第三个例子一开始还没有看懂，后面看了下讲解，最长子序列不是子串
  // 滑动窗口。
  //1.string转数组
  // console.log('xx', arr);
  //2.构建一个窗口
  let arr = [], max = 0;
  for(let i =0; i < s.length; i++){
    let index = arr.indexOf(s[i]);
    console.log(index, s[i])

    if(index!==-1){
      arr.splice(0, index + 1);
    }
    arr.push(s.charAt(i));
    max = Math.max(arr.length, max);
  }
  return max
}
console.log(lengthOfLongestSubstring("abcabcbb"));