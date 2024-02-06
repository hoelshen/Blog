/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function (head) {
  let current = head;
  const arr = [];
  // 完成转为数组列表
  while (current !== null) {
      arr.push(current.val);
      current = current.next;
  }
  // 利用双指针实现
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
      if (arr[left] !== arr[right]) {
          return false;
      }
      left++;
      right--;
  }
  return true
};