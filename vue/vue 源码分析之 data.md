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


为什么data必须是函数呢

new 的时候， 它首先需要创建一个个组件构造器，然后注册组件。注册组件的本质其实就是建立一个组件构造器的引用。使用组件才是真正创建一个组件实例。所以，注册组件其实并不产生新的组件类，但会产生一个可以用来实例化的新方式。

理解这点后， 在理解 js 的原型链

```js
var MyComponent = function() {}
MyComponent.prototype.data = {
  a: 1,
  b: 2,
}
// 上面是一个虚拟的组件构造器，真实的组件构造器方法很多

var component1 = new MyComponent()
var component2 = new MyComponent()
// 上面实例化出来两个组件实例，也就是通过<my-component>调用，创建的两个实例

component1.data.a === component2.data.a // true
component1.data.b = 5
component2.data.b // 5


```

如果两个实力同时引用同一个对象，那么当你修改其中一个属性的时候， 另外一个实力也会跟着改。

```js
var MyComponent = function() {
  this.data = this.data()
}
MyComponent.prototype.data = function() {
  return {
    a: 1,
    b: 2,
  }
}
```

Vue-组件的data属性为什么必须是函数？
return 为什么返回的是函数不是对象
JS中的实例是通过构造函数来创建的，每个构造函数可以new出很多个实例，那么每个实例都会继承原型上的方法或属性。

vue的data数据其实是vue原型上的属性，数据存在于内存当中

vue为了保证每个实例上的data数据的独立性，规定了必须使用函数，而不是对象。

因为使用对象的话，每个实例（组件）上使用的data数据是相互影响的，这当然就不是我们想要的了。对象是对于内存地址的引用，直接定义个对象的话组件之间都会使用这个对象，这样会造成组件之间数据相互影响。

一般在公司环境使用中，各种前端框架都会用一下，因为不同框架理念和使用场景有些许区别，有的重规模化，有的追求轻便易上手；有的模块化程度很高，有的通常全部写一起；有的规则安排的明明白白，有的又需要各种语法糖……虽然最近几个月工作特别忙，但是还是拿出了一点点时间来扩充一下Vue的背景知识。

为什么组件的data属性必须是函数？
在自定义模块的新手上路部分，Vue文档是这么写的

通过 Vue 构造器传入的各种选项大多数都可以在组件里用。data 是一个例外，它必须是函数。如果定义了一个对象，那么 Vue 会停止，并在控制台发出警告，告诉你在组件中 data 必须是一个函数。


有一点觉得很奇怪，明明new Vue()的时候，data是可以传入一个对象的，为什么在组件这里，data就必须为函数了呢？

简而言之，组件的配置（options）和实例（instance）是需要分开的。最根本原因是js对于对象（以及数组等）是传引用的，因为如果直接写一个对象进去，那么当依此配置初始化了多个实例之后，这个对象必定是多个实例共享的。

举两个例子就明白了

例子1
```js
config = {
  data: {
    name: 'foo'
  }
};
 
function someComponent (config) {
  this.data = config.data;
}
 
let c1 = new someComponent(config);
 
let c2 = new someComponent(config);
 
c1.data.name = 'bar';
console.log(c2.data.name); // 'bar'
```
例子2

```js
config = {
  data: function () {
    return {
      name: 'foo'
    };
  }
};
 
function someComponent (config) {
  this.data = config.data();
}
 
let c1 = new someComponent(config);
 
let c2 = new someComponent(config);
 
c1.data.name = 'bar';
 
console.log(c2.data.name); // 'foo'
```
为了加深印象，还是把相关部分都扯一点。

组件（Component）定义方式
写完hello world的同学都知道，组件在定义的时候，可以全局（Vue.component()）或者局部注册

```js
new Vue({
  // ...
  components: {
    // <my-component> 将只在父模板可用
    'my-component': Child
  }
})
```
两种方法并没有本质区别，都需要在data属性里传入对象。局部注册只是放在了new Vue的options处理部分，仍然是Vue.extend(definition)里判断。

下面以全局注册为例过一遍Vue源码。

前面说的报错位置在这里

```js
strats.data // vue-template-compiler/build.js
...
if (typeof childVal !== 'function') {
    "development" !== 'production' && warn(
      'The "data" option should be a function ' +
      'that returns a per-instance value in component ' +
      'definitions.',
      vm
    )
    return parentVal
}
...
```
这个函数简单来说，是负责data字段内容处理的，不管是new Vue的参数里data还是组件初始化的data，都要经过这里。

简单起见，从这个位置往上倒（二声）到开头：

```js
initGlobalAPI (Vue)
-function initAssetRegisters (Vue)
...
到这一步结束，按照_assetTypes（包括'component','directive','filter'）挂载方法。这里挂载了Vue.component的初始化方法，但还没调用。

经过一众其他内部操作。直到执行我们的代码（组件是从官方文档抄过来的）

```

```js
Vue.component('button-counter', {
  data: function () {
    return {
      counter: 0
    }
  }
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
 
-Vue.extend(definition)
definition内容：

```
{
  data: function () {...},
  "template": "<button v-on:click=\"count++\">You clicked me {{ count }} times.</button>",
  "name": "button-counter"
}
写入组件的配置：

```js
Sub.options = mergeOptions(Super.options,  definition)
-mergeField('data')
-strats.data
```
这一步就是前面报错的那一步，会判断data是否为函数，是则执行并挂载函数方法。否则返回父级属性。

vue-component-config

组件挂载结果
看起来3个_assetTypes加了s，是在代码里搞的

```js
config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})
在实际使用时，才会初始化组件，即调用

```

```js
function VueComponent (options) {
      this._init(options)
}
```
## 初始化Vue实例时的处理

new Vue的时候，也会调用mergeOptions，不同的是这时候传入了vm实例。这时在mergeField('data')里走了另外一条路线：

```js
return function mergedInstanceDataFn () {
// ...
    var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal
// ...
```
