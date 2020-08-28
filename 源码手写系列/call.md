# call

我们先来看个例子

```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = 'food';
}

console.log(new Food('cheese', 5).name);
// expected output: "cheese"
```

```js
Function.prototype.call = function(context) {
  context = context ? Object(context) : window;
  context.fn = this;
  let args = [];
  for(let i = 1; i < arguments.length; i++){
    args.push(`${arguments[i]}`)
  }

  let res = eval(`${context.fn(args)}`)
  console.log('res: ', res);
  delete context.fn;

  return res
}

```
