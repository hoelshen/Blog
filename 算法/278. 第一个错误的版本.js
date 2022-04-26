278. 第一个错误的版本

/**
 * Definition for isBadVersion()
 * 
 * @param {integer} version number
 * @return {boolean} whether the version is bad
 * isBadVersion = function(version) {
 *     ...
 * };
 */

/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function(isBadVersion) {
    /**
     * @param {integer} n Total versions
     * @return {integer} The first bad version
     */
    return function(n) {
        // 筛选出相同的
        let left = 1; right = n;
        while(left < right) {
          const mid = Math.floor(left + (right - left) / 2); // 防止计算时溢出
          if(isBadVersion(mid)){
            right = mid; // 答案在区间[left, mid]
          } else {
            left = mid + 1; // 答案在区间[mid+1, right]
          }
        }
        // 此时有 left == right，区间缩为一个点，即为答案
        return left;
    };
};

isBadVersion(3);
isBadVersion(5);
isBadVersion(4);