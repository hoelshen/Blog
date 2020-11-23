# vue composition api

1. vue3 使用js 实现了类型推断，新版 api 全部采用普通函数，避免使用了装饰器@
2. 解决了多组件间逻辑重用问题
3. composition api 简单。


```js
let oldArrayPrototype = Array.prototype;
let proto = Object.create(oldArrayPrototype); //继承
['push', 'shift', 'unshfit'].forEach(method =>{  //函数劫持， 把函数重写  内部 继续调用老的方法
  updateView(); //切片变成
  oldArrayPrototype[method].call(this, ...arguments)
})

function observer(target){
  if(typeof target ! == 'object' || target == null){
    return target ;
  }
  if(Array.isArray(target)){  //拦截数组，对数组的方法进行重写
    Object.setPrototypeOf(target, proto)  //写个循环， 赋予给target
    // target.__proto———— = proto;
  }
  for(let key in target){
    definReactive(target, key, target[key])
  }
}
function definReactive(target, key, value){
  observer(value); //递归
  Object.defineProperty(target, key ,{
    get(){
      return value
    },
    set(newValue){
      if(newValue !== value){
        observer(newValue);
        updateView();
        value = newValue;
      }
    }
  })
}


let data = {name: 'sjh', age:[1,2,3]}

observer(data);

data.age.push(4)
console.log('data: ', data.age);


```


更好的代码管理方式： monorepo
reactivity 响应式库 是可以独立于vue.js 使用的


通过在编译阶段优化编译的结果，实现运行时的 patch 过程的优化

Block tree 
block tree 是一个将模板基于动态节点指令切割的嵌套区块， 每个区块内部的节点结构是固定的
每个区块只需要以一个array 来追踪自身包含的动态节点

借助block tree， vue。js 将vnode 更新性能由模板整体大小相关提升为与动态内容的数量相关。


编译优化：
在编译阶段还包含对Slot的编译优化、事件侦听函数的缓存优化， 并在运行时重写了diff 算法

编写组件本质就是在编写一个『包含了描述组件选项的对象』我们把他称为 Options API 

提供了一种新的api： composition api
就是将某个逻辑关注点相关的代码全部放在一个函数里， 这样当需要修改一个功能时，就不在需要在文件中跳来跳去

除了在逻辑复用方面有优势， 也会有更好的类型支持

因为他们都是一些函数， 在调用函数时， 自然所有的类型就被推导出来了 不像Options API 所有的东西使用this
另外， Composition API 对tree-shaking 友好， 代码也更容易压缩。

在 vue 中一个组件真正的渲染生成DOM的几个步骤

创建vnode => 渲染vnode => 生成Dom

应用初始化
在执行app.mount 的时候， 不需要传入渲染器render
因为在执行createAppAPI 的时候 渲染器render 参数已经被保留下来了


我们可以根据vnode 在去生成不同平台的代码
例如服务端渲染 小程序端  weex 端
性能并不是vnode 的优势

![](https://tva1.sinaimg.cn/large/0081Kckwgy1gkzj8497i1j312a0eiado.jpg)
