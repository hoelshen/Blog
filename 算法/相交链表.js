/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  // 相交链表的一个特点是 a 和 b 走不同的数，如果出现相遇，且后续的集合都存在，则代表相交, 
  const hashMap = new Map();
  let temp = headA;
  while (temp !== null) {
      hashMap.set(temp);
      temp = temp.next
  }
  temp = headB;
  while (temp !== null) {
      if (hashMap.has(temp)) {
          return temp;
      }
      temp = temp.next
  }
  return null
};