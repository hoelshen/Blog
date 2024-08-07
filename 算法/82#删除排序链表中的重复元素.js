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
  // 额外的节点处理头部节点
  const dummy = new ListNode(-1);
  dummy.next = head;
  let cur = dummy;
  while (cur.next && cur.next.next) {
    // 需要找到当前的前一个存起来方便相当的时候能够直接删除
    if (cur.next.val == cur.next.next.val) {
      let val = cur.next.val;
      while (cur.next && cur.next.val == val) {
        cur.next = cur.next.next;
      }
    } else {
      cur = cur.next;
    }
  }
  return dummy.next;
};
