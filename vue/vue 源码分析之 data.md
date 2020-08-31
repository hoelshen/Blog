#  vue 源码分析

## 题记
 这是 vue 源码分析的第一节，学习 vue 有接近两年时间了，入手的第一份工作，就是从 vue 开始，本着自我驱动能力，渡人渡己。现在分析一下vue源码。组里老大经常说不管做什么事先想清楚，哪怕你一天只做一件事也好，所以文章可能出的比较慢，敬请耐心等待。本系列采用周更形式，每周三准时发车。
分析课会按照以下大纲来： 每周一篇的形式（算是立了个 flag 吗😂）。

[TOC]

      ├── vue.extend
      ├── vue.nextTick
      ├── vue.set
      ├── vue.delete
      ├── vue.directive
      ├── vue.filter
      ├── vue.use
      ├── vue.mixin
      ├── vue.compile
      ├── vue.observable   
      ├── vue.version
      ├── [data](#data)
      ├── [props](#props)
      ├── propsData  
      ├── [computed](#computed)  
      ├── methods
      └── watch



## 双向绑定
实现双向绑定的方式有很多。
### [data](#data)

 监听者（observer）: 对数据增加 getter  和  setter，以及往观察者列表中增加观察者，当数据变动时去通知观察者列表。
  观察者列表(Dep): 这个模块的主要作用是维护一个属性的观察者列表，当这个属性触发getter时将观察者添加到列表中，当属性触发setter造成数据变化时通知所有观察者，
  观察者（watch）：这个对数据进行观察，一旦收到数据变化的通知就会去改变视图.
```js









```
## [props](#props)

```js





```


## [computed](#computed)



```js




```