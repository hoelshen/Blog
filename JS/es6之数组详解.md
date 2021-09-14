

1. Array.form
  第二个参数， 这个函数用来将类数组对象中的每一个值转换成其他形式， 最后将这些结果存储在结果数组的相应索引中
  如果用映射函数处理对象， 也可以将第三个参数传入表示映射函数的 this 值。
 
    ```js
  let helper = {
    diff: 1,
     add(value){
       return value + this.diff
     }
  }

  function translate(){
    return array.from(arguments, helper.add, helper)
  }

  let number = translate(1,2,3);

  console.log('number', number);
  ```


与其他函数不同，内联事件处理函数的作用域链从头部开始依次是：调用对象、该元素的 DOM 对象、该元素所属 FORM 的 DOM 对象（如果有）、document 对象、window 对象（全局对象）。且这个链条并不是所有浏览器中的实现是一致的。







