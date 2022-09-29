//剑指 Offer II 026. 重排链表

// 重两端到中间拼接
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */
var reorderList = function (head) {
  if (!head) return head;
  if (!head.next) return head;
  let arr = [];
  let cur = head;
  head = head.next;
  while (head) {
    cur.next = null;
    app.push(cur);
    cur = head;
    head = head.next
  }
  arr.push(cur);
  let left = 0;
  let right = arr.length - 1;
  let res = arr[0];
  while (left < right - 1) {
    arr[left].next = arr[right];
    left++;
    arr[right].next = arr[left];
    right--;
  }
  if (left === right - 1) arr[left].next = arr[right];
  return res
};