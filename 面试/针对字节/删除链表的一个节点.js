// 删除链表的一个节点; 删除链表的节点
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
function deleteNode(head, node) {
  // find 这个节点，把指向next指向这个节点的next
  if (head.val == node) return head.next; //要删除的是头结点，直接返回头结点的next
  let cur = head;
  while (cur.next) {
    if (cur.next.val == node) {
      cur.next = cur.next.next;
      return head;
    }
    cur = cur.next;
  }
}