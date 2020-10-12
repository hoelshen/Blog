# forEach vs Map



## Map
```js
console.log(

[1, 2, 3].map(item => {

​ console.log(item)

})
//1
//2
//3
// [undefined, undefined, undefined]

```
## 对比
forEach() -- 对数组中的每个元素执行提供的函数
map() -- 在被调用的数组基础上创建一个新数组，并对数组中的每个元素执行方法


## 总结

* 几乎能用forEach()实现的功能，都可以使用map()实现，反之亦然。
* map()分配内存并存储返回值。forEach()摒弃返回值，并最终返回undefined（这个方法没有返回值）。
* forEach()允许回调函数更改当前的数组。map()将返回一个新数组。

行内元素(包括<img>标签)，为了保证不同标签的垂直对齐和题主这种问题，都会考虑是否加上合适的vertical-align，一般取值为middle