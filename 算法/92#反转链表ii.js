/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
  var dummyNode = new ListNode(-1);
  dummyNode.next = head;

  let pre = dummyNode;

  for (let i = 0; i < left - 1; i++) {
    pre = pre.next;
  }

  let rightNode = pre;
  for (let i = 0; i < right - left + 1; i++) {
    rightNode = rightNode.next;
  }


  // 
  let leftNode = pre.next;
  let curr = rightNode.next;

  pre.next = null;
  rightNode.next = null;

  reverseLinkedList(leftNode);

  // 第5步： 接回原来的链表中
  pre.next = rightNode;
  leftNode.next = curr;
  return dummyNode.next;
};