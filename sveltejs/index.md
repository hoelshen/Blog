 为了解决什么
 通过静态编译减少框架运行时的代码量

 vue 和 react 都必须引入runtime 代码， 用于虚拟 dom、diff 算法

## No Runtime --- 无运行时代码
    react 都是基于运行时的框架， 当用户在你的页面进行各种操作必须改变组件的状态时，框架的运行时都会根据新的组件状态（state）计算（diff）出哪些 dom 节点需要被更新，从而更新视图

## less-code --- 简洁代码    
    更好的语义话

## hight-performance --- 高性能

![](https://tva1.sinaimg.cn/large/008eGmZEgy1gnzlnmolgdj31mc0u07g2.jpg)

react/vue 项目自带的runtime 虽然会增加首屏加载的bundle.js， 可是项目变得越来越大的时候， 框架的runtime 在bundle.js里面占据的比例也会越小

Fiber 思路是不减少渲染工作量，把渲染工作拆分成小任务思路是不减少渲染工作量。渲染过程中，留出时间来处理用户响应，让用户感觉起来变快了。这样会带来额外的问题，不得不加载额外的代码，用于处理复杂的运行时调度工作



















































