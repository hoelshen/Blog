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

var hasCycle = function(head) {
    var node = new ListNode(head);
    var arry = [];
    while(node.next){
      Object.keys(node).forEach(function(key){
          if('count' === key){
            if(arry.indexOf(node.count) !== -1){
              return true;
            }
          }
      });
      arry.push(node);
      node = node.next;
      count++;
    }
};



