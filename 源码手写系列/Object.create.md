
```js
const myCreate = function (obj) {
  function F() {};
  F.prototype = obj;
  return new F();
}
```