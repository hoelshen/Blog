// 请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
// 实现 LRUCache 类：
// LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
// int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
// void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
// 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。

// 解题思路
// 1、一个节点包含key、value、pre和next；
// 2、定义两个哨兵节点-头结点、尾节点；
// 3、使用map保存所以的节点；

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  this.capacity = capacity;
  this.head = {};
  this.tail = {};
  this.head.next = this.tail;
  this.tail.pre = this.head;
  this.size = 0;
  this.map = new Map();
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  if (this.map.has(key)) {
    let node = this.map.get(key);
    this.moveToHead(key, node.value);
    return node.value;
  }
  return -1;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  if (this.map.has(key)) {
    this.moveToHead(key, value);
  } else {
    if (this.size < this.capacity) {
      this.addHead(key, value);
    } else {
      this.deleteTail();
      this.addHead(key, value);
    }
  }
};

LRUCache.prototype.deleteNode = function (key) {
  let node = this.map.get(key);
  let preNode = node.pre;
  let nextNode = node.next;
  preNode.next = nextNode;
  nextNode.pre = preNode;
  this.size--;
  this.map.delete(key);
};

LRUCache.prototype.deleteTail = function () {
  let tailPre = this.tail.pre;
  tailPre.pre.next = this.tail;
  this.tail.pre = tailPre.pre;
  this.size--;
  this.map.delete(tailPre.key);
};

LRUCache.prototype.addHead = function (key, value) {
  let newNode = { key: key, value: value };
  newNode.next = this.head.next;
  this.head.next.pre = newNode;
  this.head.next = newNode;
  newNode.pre = this.head;
  this.map.set(key, newNode);
  this.size++;
};

LRUCache.prototype.moveToHead = function (key, value) {
  this.deleteNode(key);
  this.addHead(key, value);
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

// 简易版本
function LRUCache(capacity) {
  if (capacity < 1) return;
  const map = new Map();
  function get(key) {
    if (map.has(key)) {
      const result = map.get(key);
      if (typeof result === "number") {
        // MoveToHead
        map.delete(key);
        map.set(key, result);
        return result;
      }
    }
    return -1;
  }
  function put(key, value) {
    if (map.has(key)) {
      // MoveToHead
      map.delete(key);
      map.set(key, value);
    } else {
      // addToHead
      map.set(key, value);
      if (map.size > capacity) {
        // removeTail
        const firstKey = ((map) => {
          for (const key of map.keys()) {
            return key;
          }
          throw Error("empty map");
        })(map);
        map.delete(firstKey);
      }
    }
  }
  return { get, put };
}
