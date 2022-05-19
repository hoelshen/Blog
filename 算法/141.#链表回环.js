## 链表回环
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    // 判断next指向
    var node = new ListNode(head);
    var arry = [];
    var count = 0;
    while(node.next){
        if(arry.indexOf(node.count) !== -1){
            return true;
        }
        arry.push(node.count);
        node = node.next;
        count++;
    }
};

## JSON.stringify判断

var hasCycle = function (head) {
  try {
      JSON.stringify(head)
  } catch{
      return true
  }
  return false
};

const hasCycle = function(head) {
  while (head) {
    if (head.tag) {
      return true;
    }
    head.tag = true;
    head = head.next;
  }
  return false;
};

var hasCycle = function(head) {
  let fast = slow = head
  while(fast && fast.next) {
      fast = fast.next.next
      slow = slow.next
      if (fast == slow) {
          return true
      }
  }
  return false
};
