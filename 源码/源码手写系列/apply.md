# call

我们先来看个例子

```js
const number = [5,6,2,3,7]
const max = math.max.apply(null, numbers);

console.log(max)
```

```js
Function.prototype.call = function(context, args) {
  context = context ? Object(context) : window;
  context.fn = this;
  if(!args) return context.fn()
  
  let res = eval(`context.fn(${args})`)
  delete context.fn;

  return res
}

```
