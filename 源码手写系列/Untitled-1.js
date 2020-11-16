/**
 * initialize your data structure here.
 */
var MinStack = function() {
  this.mini = 0;
  this.array = [];
};

/** 
* @param {number} x
* @return {void}
*/
MinStack.prototype.push = function(x) {
  this.array.push(x);
  this.mini = this.mini > x ?  x : this.mini;
};

/**
* @return {void}
*/
MinStack.prototype.pop = function() {
  this.array.pop();
};

/**
* @return {number}
*/
MinStack.prototype.top = function() {
  return this.array[this.array.length -1]
};

/**
* @return {number}
*/
MinStack.prototype.min = function() {
  return this.mini
};

/**
* Your MinStack object will be instantiated and called as such:
* var obj = new MinStack()
* obj.push(x)
* obj.pop()
* var param_3 = obj.top()
* var param_4 = obj.min()
*/

var minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.min());   // --> 返回 -3.
console.log(minStack.pop());
console.log(minStack.top());     //  --> 返回 0.
console.log(minStack.min());  //  --> 返回 -2.
