// 链表中环的入口节点;


var x = function (head) {
  if (head === null) {
    return null;
  }
  let slow = head, fast = head;
  while (fast !== null) {
    slow = slow.next;
    if (fast.next !== null) {
      fast = fast.next.next;
    } else {
      return null;
    }
    if (fast === slow) {
      // 我们发现slow 与 fast 相遇时，我们在额外使用一个指针ptr，起始，它指向链表头部；随后，它和slow每次向后移动一个位置。最终，它们会在环点相遇
      let ptr = head;
      while (ptr !== slow) {
        ptr = ptr.next;
        slow = slow.next;
      }
      return ptr
    }

  }
  
}