标准的内置迭代器，也可以构造自己的迭代器
消费者工具(for..of循环以及...运算)



迭代有着一套属于自己的迭代协议，这规定了迭代与实现的逻辑，它之所以能够工作是因为依靠着迭代器(具体的迭代实现逻辑)、迭代对象(实现了[Symbol.iterator]方法的可被迭代对象)和迭代语句(例如for...in和for..of)


```js
var obj={
  a:1,
  b:2
}

for(var i of obj){ //obj is not iterable
    console.log(i,obj[i])
}

//执行的顺序为
Uncaught TypeError: obj is not iterable
```

![迭代器](https://tva1.sinaimg.cn/large/0081Kckwgy1gkjzsfqf2gj30u00yjdhr.jpg)

来查看一下对象是否有实现[Symbol.iterator],结果是对象上默认是不支持迭代的，没有[Symbol.iterator],这也就解释了为什么通过for...of默认迭代不了对象的原因。


```js
let obj = {
    a: 1,
    b: 2,
    c: 3
};


obj[Symbol.iterator] = function(){
  // 迭代协议--希望根据什么规则来循环
  // values=[1,2,3]
  let values = Object.values(obj);


  // console.log(values) //[1,2,3]
  // 用来遍历values的值  values[0]、 values[1]、 values[2]
  let index = 0;



  return {
      next(){
          if(index >= values.length){
              return {
                  //是否循环是否遍历迭代完成
                  //循环结束时不会在走到for-of里面
                  //循环执行完成就算这里写了value也是没有用的不会再影响循环结果了
                  done: true,
                  value:'无用'
              }
          } else {
              return {
                  //一直没有执行完成
                  done: false,
                  //value是我们在循环过程中的值
                  value:  values[index++]
              }
          }
      }
  }
};


```