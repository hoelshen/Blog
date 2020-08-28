# instanceOf



```js
function myInstanceOf(left, right){
  left = left.prototype;
  right = right.__proto__;

  while(true){
    if(left === null) return false;
    if(right === left) return true;

    left = left.__proto__;
  }
}



```