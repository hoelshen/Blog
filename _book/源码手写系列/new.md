# new


```js
const myNew = function(){
  let Constructor = Array.prototype.shift.call(arguments);
  let obj = {};
  obj.__proto__ =Constructor.prototype;

  let res = Constructor.apply(obj, arguments);

  return res instanceOf Object ? res : obj;
}




```