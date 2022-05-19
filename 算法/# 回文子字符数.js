
# 回文子字符数

具有不同开始位置或结束位置的子串，即使是由相同的字符组成，也会被视作不同的子串。

/**
 * @param {string} s
 * @return {number}
 */
<!-- 
示例 1：

输入：s = "abc"
输出：3
解释：三个回文子串: "a", "b", "c"
示例 2：

输入：s = "aaa"
输出：6
解释：6个回文子串: "a", "a", "a", "aa", "aa", "aaa"
 

提示：

* 1 <= s.length <= 1000
* s 由小写英文字母组成 -->

```js
var countSubstrings = function(s) {
  var countArr = s.split('');
  // 从1 开始 获取到总长度
  var num = 1;
  var sumArr = [];
  while(num <= countArr.length){
    // 获取一步 从num 截止到数组索引point  每次获得n个数字的切割值
    for(var i =num; i<countArr.length; i++) {
      sumArr.push(countArr[i]);
    }
    num++;
  }
  return sumArr
};
```

```js
var countSubstrings = function (s) {
    let count = 0;
    for (let i = 0; i < s.length; i++) {
        let s1 = '', s2 = '';
        for (let j = i; j < s.length; j++) {
            s1 += s[j], s2 = s[j] + s2;
            if (s1 === s2) count++;
        }
    }

    return count;
};

console.log(countSubstrings('abc'));
```

```js
var countSubstrings = function(s) {
    const n = s.length;
    let ans = 0;
    for (let i = 0; i < 2 * n - 1; ++i) {
        let l = i / 2, r = i / 2 + i % 2;
        while (l >= 0 && r < n && s.charAt(l) == s.charAt(r)) {
            --l;
            ++r;
            ++ans;
        }
    }
    return ans;
};
```
