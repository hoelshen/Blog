/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function (head) {
  // 当数组没有重复的时候返回
  if (head == null || head.next == null) {
    return head;
  }
  head.next = deleteDuplicates(head.next);
  // 有重复则删除
  if (head.next.val == head.val) {
    head = head.next;
  }
  return head;
};
