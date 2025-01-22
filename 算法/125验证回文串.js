/**回文算法
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(str) {
  // 清理字符串
  let cleaned = str.replace(/[^0-9a-z]/gi, "").toLowerCase();

  // 双指针：从两端向中间比较
  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

// 测试
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false
console.log(isPalindrome("12321")); // true

var str = "A man, a plan, a canal: Panama";
var val = isPalindrome(str);
console.log("val: ", val);
