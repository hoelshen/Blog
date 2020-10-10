# apply vs bind vs call

简言之，call和bind传参一样；apply如果要传第二个参数的话，应该传递一个类数组。

调用后是否立执行
call和apply在函数调用它们之后，会立即执行这个函数；而函数调用bind之后，会返回调用函数的引用，如果要执行的话，需要执行返回的函数引用。


test.js
