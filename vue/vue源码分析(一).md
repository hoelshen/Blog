vue-router

核心：  数据驱动  组件化  响应式原理  

1. 准备工作： flow、目录结构、源码构建
2. 数据驱动： 数据->dom创建完整流程
3. 组件化： 组件创建、组件相关核心概念
4. 响应式原理： 完整讲诉响应式实现原理

编译：  parse  optimize  codegen

编译：
1.parse ： 模版 ->ast树
optimize： 优化ast树
codegen： ast树 ->代码

扩展： event、v-model  slot、keep-alive transition 

event & v-model: 事件 和v-model的实现原理
slot & keep-alive: 内置组件的实现原理
transition…: 过渡的实现原理

生态： vue-router vuex

官方路由实现原理
官方状态实现原理

vue 不是用 es6 写的
flow 

vue 源码自定义了很多类型 例如 decalre interface VNodeData

libs 部分用来描述包含指定库定义的目录

*compiler  virtual dom render function  写的都是tml

*core 内置组件 global-api keep-alive  instance实例化 生命周期 oberver应式 utils vdom  

*platform  web  wexx  mpvue  

放一些平台编译  运行时的相关代码  server  util 

*server  服务端的代码跑在node上，渲染成html字符串，将它们直接发送到浏览器

*sfc  简单的解释器  .vue 文件编译出js对象

*shared  常量  工具方法

子继承父类的话  就是 
先看下父类的constructor里面有没有定义this 如果有的话 子类的方法能够读到
如果父类constructor没有定义 子类constructor 定义也是子类方法读取的到

super(xxx) 一定要在前面  不然会错
 Must call super constructor in derived class before accessing 

vue rollup 构建出cjs(COMMONJS)  es（ES MODULE）umd  （umd规范）三个版本

runtime-only  在开发过程中
runtime-compl  是将tml 转成render 所以我们源码分析的时候会基于此来分析.

如果没有对代码做预编译，但又引入了vue 的tpl并传入一个字符串，则需要在客户端编译了 这时候就需要runtime+ compiler

mixn 能够将vue 的原型 拆分到不同文件下 利于管理

``` js
Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
    get() {
        /* istanbul ignore next */
        return this.$vnode && this.$vnode.ssrContext
    }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
})
```

vue 的这个写法有点溜啊 
全局config
global-api 包含了 extend mixin use asset

init 初始化： lifecycle  event render hook injections state  provide

对源码进行单步调试： debugger
断点调试： 第一个是跳到下一个端点  第二个是跳过这个逻辑 第三个是进入到函数里面 

state 里面会做options 接收函数判断：

1. props   initProps
2. methods initMethos
3. data if(){ initData(vm)} else{ oberve vm._data = {}, true}
4. computed
5. watch

  ok  我们看看data 做了什么 typeof data ==== ‘function’  我们更倾向于return 一个对象
  为什么我们能够在mouted直接访问到 this.xxx
  因为 proxy 做了一层代理(vm, _data, {xxx})
初始化的最后 如果有 el 属性， 则调用vm.$mount
首先对el做了限制。不能挂载在body，html这样的根节点上。

``` js
if (vm.options.render) createEmptyVNode
$mount = function() {
    return mountComponent(this, el, hydrating)
}
```

在 lifecycle 中 

``` js
vm.$options.render = createEmptyNode
performace 做性能埋点

if (updateComponent) {
    new Watcher(), 在它的回调中调用updateComponent方法， 在此方法中调用vm._render方法 生成node, 最终调用vm.update 更新DOM
}
```

渲染watcher

在定义的watcher 里面 有个
```js 
constructor(

	vm:Component,
	expOrFn:string | Function,
	cb:Function,
	options:?: ?object,
	isRenderWatcher? : boolean

){
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    this.cb = cb
    this.expression = process.env. NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
  }

``` 
watcher 初始化的时候会执行回调函数，另一个当vm实例中的监测数据发生变化的时候执行回调函数

render 函数
vm.$render.call(vm._renderProxy, vm.$createElement); 

执行 initRender 方法 $createElement， 返回vnode。

createElement包含五个属性： context 、tag、data、children、normalizationType

virtual dom 就是用一个原生的js对象去描述一个dom节点，所以它比创建dom的代价小很多。

vnode 是对真实dom 的一种抽象描述， 它的核心定义无非就是： 标签名、数据、子节点、键值。

我们根据 simple_normalize  always_normalize 判断两种类型 

1. simpleNormalizeChidlren   children包含函数式组件，可能返回一个数组而不是根结点，使用 for 循环遍历，进行concat 拼接

2.（1）render函数是用户手写的，当children 只有一个节点的时候， 会调用createTextvNodex写成基础类型： isprimitive 
（2）normalizeChildren 如果是tpl、slot、v-for 的话 就判断有没有children.normalizeArrayChildren

VNode的创建
我们对tag 对判断
```js
if(string){

	if(内置节点){
		Vnode
	}  else if(组册组件) {
		createComponent 创建一个组件类型的Vnode
	} else {
	 未知标签的vnode
	}

} 
if(component){

	createComponent 创建一个组件类型的Vnode

}
```

_update  被调用的时机有两个： 首次渲染、数据更新的时候。

__patch__  = isBrowser ? path : noop

createPatchFunction 传入一个对象，包含nodeOps参数和modules 参数
nodeOps封装了一系列dom操作 
modules 定义了一些模块的钩子函数

function patch (oldVnode, vnode, hydrating, removeOnly) 
oldvnode 表示旧节点， vnode 表示执行render后返回的vnode节点， hydrating表示是否是服务端渲染，removeOnly表示是给transition-group用的

hooks = 【’create’, ‘active’, ‘update’, ‘remove’, ’destroy’】

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          nodeOps.nextSibling(oldElm)
        )

createElment 作用是通过虚拟节点创建真实的dom并插入到它的父节点中
createchildren 方法创建子元素  遍历子虚拟节点， 递归调用createElment 

接着再调用 invokeCreateHooks 方法执行所有的 create 的钩子并把 vnode push 到 insertedVnodeQueue 中。

最后调用 insert 方法把 DOM 插入到父节点中，因为是递归调用，子元素会优先调用 insert，所以整个 vnode 树节点的插入顺序是先子后父。

这是最后的总结图
￼

构造子类构造函数，安装组件钩子函数和实例化 vnode

const baseCtor = context.$options._base

mergeOptions 将vue构造函数的options 和用户传入的options 做一层合并，到vm.$optiosn
子组件  构造器 extends 父组件的一些状态 还拥有自己的options
继承于vue的构造器sub，做一些属性扩展（globalapi、options、props、computed）

Vue.extend(){
$super = this
cacheCtos
 const Sub = function VueComponent (options) {

    this._init(options)

  }
Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.options = mergeOptions(

    Super.options,
    extendOptions

  )
  Sub['super'] = Super
}

最后对sub 构造器函数做缓存，避免多次执行vue.extend的时候对同一个子组件重复构造。

installComponentHooks(data) 将组件的一些状态 merge
遍历 hooksToMerge = object.keys(componentVNodeHooks
)
componentVNodeHooks有 init 、 prepatch、insert、destroy 将其合并到data.hook，在vnode执行patch执行相关钩子函数
如果某个时机的钩子已经存在 data.hook 中，那么通过执行 mergeHook 函数做合并。

实例化vnode
没有children 且 传入一个对象

``` js
let a = {
    _age: 18
}
let b = function() {
    return {

        name: 'nancy',
        age: (() => {
            return this._age
        })

    }
}
let c = b.call(a)
```

组件vnode 创建的时候合并钩子函数执行init 
createComponentInstanceForVnode了一个实例。

child节点在父组件渲染的时候生成”组件vnode”，并且在父组件的patch过程，递归初始化child组件，同时把这个“组件vnode”当作parentVnode传入

vm.$parent = parent
vm.$vnode = _parentVnode  当前组件的父Vnode
vm._parentVnode = parenVnode

vm._vnode.parent === vm.$vnode 

占位符vnode

patch 先子节点渲染在插入父节点
createComponent -> 子组件初始化 -> 子组件render ->子组件patch

activeInstance 为当前激活的vm实例； vm.$vnode为组件的占位vnode, vm._vnode为组件的渲染vnode

vue 整个初始化是一个深度遍历的过程，在实例化子组件的过程中，它需要知道当前上下文的vue实例是什么。并把它作为子组件的父Vue实例。

我们现在在来梳理一下整个流程：
传入的vnode组件渲染vnode，createComponent： initComponent 、insert(parenElm, vnode)

options 的组件场景

vue.$options = mergeOption 函数
mergeOptions（resloveConstructorOptions ） && options 
options 在globalapi 中定义
initglobal里面执行 
const Aeest_types = [‘component’, ‘directive’, ‘filter’]  
  ASSET_TYPES.forEach(type => {

    Vue.options[type + 's'] = Object.create(null)

  })

最后在extend(Vue.options.components, builtInComponents)
extend 一些vue内置组件到vue.options.components

mergeOptions 函数主要把parent 和child 这两个对象根据一些合并策略，合并成一个新对象

递归 extend & mixins 合并到parent 上， 遍历parent 调用mergeField

mergeFiled 合并hook 和props 类型遵循下面的规律的数组

``` js
function mergeHook(
    parentVal: ? Array < Function > ,
    childVal : ? Function | ? Array < Function >
): ? Array < Function > {
    const res = childVal ?
        parentVal ?
        parentVal.concat(childVal) :
        Array.isArray(childVal) ?
        childVal :
        [childVal] :
        parentVal
    return res ?
        dedupeHooks(res) :
        res
}
export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
]

LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})
```

我们看看strats 怎么定义的
strats = config.optionsMergeStrategies
strats.el = strats.propsData = function(parent, child, vm, key){
} 

里面有各种各样的策略，data.watch.props=inject=methods.computed

总结：
*外部调用场景下的合并配置是通过mergeOption, 并遵循一定的合并策略
*子组件合并是通过initInternalComponent, 它的合并更快

``` js
vm.$options = {
    components: {},
    created: [

        function created() {
            console.log('parent created')
        }

    ],
    directives: {},
    filters: {},
    _base: function Vue(options) {

        // ...

    },
    el: "#app",
    render: function(h) {

        //...

    }
}
```

子组件场景：InternalComponentOptions

把实例化子组件传入的子组件父 VNode 实例 parentVnode\ 子组件的父 Vue 实例 parent 保存到 vm.$options 中，另外还保留了 parentVnode 配置中的如 propsData 等其它的属性。

生命周期

``` js
// expose real self
vm._self = vm
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

所以我们在beforeCreate 中拿不到 data props 等， 因为 initState props、data、methods、watch、computed
beforeCreate 的钩子函数中就不能获取到 props、data 中定义的值，也不能调用 methods 中定义的函数。
beforeCreate 和create 是先父组件在执行子组件
vue-router 和 vuex 的时候会发现它们都混合了 beforeCreatd 钩子函数。

#beforeMount & mounted

beforemount 是父组件先执行 在执行子组件

mount 则是子组件先执行 在执行父组件

beforeUpdate 的执行时机是在渲染 Watcher 的 before 函数中，
update 的执行时机是在flushSchedulerQueue 函数调用的时候

update 满足的条件mounted 且数据有变化

``` js
callUpdatedHooks(updatedQueue)
if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
    callHook(vm, 'updated')
}
```

重新渲染 才会执行updated
例如下面这种情况

``` js
mounted() {
        this.msg = 'sjh'
        console.log('mounted Parent')
    },
    updated() {
        console.log('updated Parent')
    }
```

 $destroy 的执行过程中，它又会执行 vm.__patch__(vm._vnode, null) 触发它子组件的销毁钩子函数，这样一层层的递归调用，所以 destroy 钩子函数执行顺序是先子后父，和 mounted 过程一样。

组件注册
全局注册  局部注册  Vue.component  components 

``` js
Vue.component('GlobalComponent', GlobalComponent)

new Vue({
    render: h => h(App),
    components: {
        GlobalComponent
    }
}).$mount('#app')
```

使用require.context 进行全局注册
const requireComponent = require.context(

	//其组件目录的相对路径
	‘./components ‘,
	//是否查询其子目录
	false;
	//匹配基础组件文件名的正则表达式
	/Base[A-Z]\w+\.(vue|js)$/

)

requireComponent.keys().forEach(filename=>{
 // 获取组件配置
  const componentConfig = requireComponent(fileName)
  // 获取组件的 PascalCase 命名
  const componentName = filename.split(‘/’)[1]
})

也可以用来加载img
var imagesContext = require.context('@/assets/kittens/', false, /\.jpg$/); 

	console.log(imagesContext)
	console.log(imagesContext('./kitten1.jpg'))
	console.log(imagesContext.keys())

}

ul、ol、table、select 等标签会限制包裹的元素  所以 我们可以采用is

自定义组件名： 字母全小写且必须包含一个连字符
initAssetRegisters函数
由于每个组件都是通过Vue.extend继承而来的

Vue.options 合并到 Sub.options，也就是组件的 options 上， 然后在组件的实例化阶段，会执行 merge options 逻辑，把 Sub.options.components 合并到 vm.$options.components 上。

resolveAsset函数：
  if (hasOwn(assets,  id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets,  camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets,  PascalCaseId)) return assets[PascalCaseId]

内置组件：
component  组件
transition  组件
transitionn-group 组件
keep-alive  组件
slot 组件

基础组件建议全局注册， 而业务组件建议局部注册
sub上面添加

异步组件加载：
Vue.component('async-example', function (resolve, reject) {
   // 这个特殊的 require 语法告诉 webpack
   // 自动将编译后的代码分割成不同的块，
   // 这些块将通过 Ajax 请求自动下载。
   require(['./my-async-component'], resolve)
})

异步组件的 3 种实现方式

总结：
本质是2次渲染， 先渲染成注释节点， 当组件加载成功后， 在通过forceRender重新渲染。

延迟加载 和 代码拆分
首先是代码拆分  webpack 根据
我们通过1. Vue.component(‘xxxx ’, function(resolve, reject){

	require(‘’, resolve)

} )
2.const MyAsyncComponent = () => ({
  // 需要加载的组件 (应该是一个  `Promise`  对象)
  component: import('./components/my-async-component'), 

静态导入 动态导入
// 静态导入模块
import utils from './utils'
// 动态导入
import('./utils').then(utils => {

    // 可以在这里使用utils模块

})

3. ()=> import (‘xxxx’)

异步组件要结合路由懒加载
懒加载组件

            const first = resolve => require.ensure([], () => resolve( require(../components/first.vue)),  'chunkname1')
            const second = resolve => require.ensure([], () => resolve( require(../components/second.vue)),  'chunkname2')
     

解释2:webpack 在编译时，会静态地解析代码中的 require.ensure()，同时将模块添加到一个分开的 chunk 当中。这个新的 chunk 会被 webpack 通过 jsonp 来按需加载

异步组件的原理：
vue注册的组件不再是一个对象，而是一个工厂函数，函数有两个参数reslove, reject， 函数内部用setTimeout模拟了异步。
asyncFactory 
工厂函数
resolveAsyncComponent函数

const res = factory(resolve , reject)

普通函数异步组件：
createAsyncPlacehilder 如果有loading 的话就不是undefined

factory.resolved = ensureCtor 生成一个构造器
forceRender 执行 $forceupdate 渲染

确保函数只执行一次：
export function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this,  arguments)
    }
  }
}

lifecycle:

Vue.prototype.$forceUpdate = function () {
  const vm: Component = this
  if (vm._watcher) {

    vm._watcher.update()

  }
}
因为先要返回一个占位的 vnode，等待异步请求加载完毕后执行 forceUpdate 重新渲染， 然后这个节点会被更新渲染成组件的节点。

factory.error 的优先等级最高 如果为error 则下面不在走。

promise异步组件
typeof res.then === ‘function’
if (isUndef(factory.resolved)) {
  res.then(resolve, reject)
}

高级异步组件：
if (isDef(res.error)) {
  factory.errorComp = ensureCtor(res.error, baseCtor)
}

if (isDef(res.loading)) {
  factory.loadingComp = ensureCtor(res.loading, baseCtor)
  if (res.delay === 0) {

    factory.loading = true

  } else {

    setTimeout(() => {
      if (isUndef(factory.resolved) && isUndef(factory.error)) {
        factory.loading = true
        forceRender()
      }
    }, res.delay || 200)

  }
}

if (isDef(res.timeout)) {
  setTimeout(() => {

    if (isUndef(factory.resolved)) {
      reject(
        process.env. NODE_ENV !== 'production'
          ? `timeout (${res.timeout}ms)` 
          : null
      )
    }

  }, res.timeout)
}

响应式原理：

响应式对象 

Vue会把props、data等变成响应式对象， 在创建过程中，若发现子属性也为对象则递归把该对象变成响应式
props初始化 遍历配置

1. 调用defineReactive把props对应的值变成响应式的, vm._props.xxx定义到props对应属性
2. vm._props.xxx的访问代理到vm.xxx

initdata 同理
1.vm._data.xxx代理到vm.xxx
2.observe观察data 变成响应式的
proxy代码如下：
const sharedPropertyDefinition = {
  enumerable: true, 
  configurable: true, 
  get: noop, 
  set: noop
}
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {

    return this[sourceKey][key]

  }
  sharedPropertyDefinition.set = function proxySetter (val) {

    this[sourceKey][key] = val

  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
proxy 方法的实现很简单，通过 Object.defineProperty 把 target[sourceKey][key] 的读写变成了对 target[key] 的读写

observe 方法的作用就是给非 VNode 的对象类型数据添加一个 Observer

Observer是一个类， 作用是给对象添加属性getter 和setter, 用于依赖收集和派发更新。
实例化dep对象 接着 def 方法封装 defineProperty  对 __ob__

shouldObserver 控制 Observer()

Observer 对数组调用observerArray
对纯对象执行walk方法。 

  observeArray (items: Array<any>) {

    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }

  }

  walk (obj: Object) {

    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }

  }

object.keys 拿到的是不可枚举的

defineReactive函数 getOwnPropertyDescriptor 

依赖收集 reactiveGetter
export function defineReactive (
」
setter 的逻辑有 2 个关键的点，一个是 childOb = !shallow && observe(newVal)，如果 shallow 为 false 的情况，会对新设置的值变成一个响应式对象；另一个是 dep.notify()

当我们在组件中对响应的数据做了修改，就会触发setter的逻辑-》dep.notify

Dep 是整个 getter 依赖收集的核心

Dep 是一个class， 定义了一些属性和方法

建立数据和watcher的桥梁
Dep{
  static target  同一时间只有唯一watcher
  id
  sub

	

}
  notify () {
  // stabilize the subscriber list first

    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }

  }

watcher{
update () {

      queueWatcher(this)

  }
addDep(){

	dep.addSub(this)

}

cleanupDep(){

	if(!this.newDepIds.has(dep.id)){
	dep.removeSub(this)
	}

}
}

如果我们没有订阅的话， 即时去修改它 也不会重新渲染。
总结： 依赖收集就是订阅数据变化的 watcher 的收集
依赖收集的目的就是当这些响应式数据发送变化，触发它们的setter的时候， 能知道应该通知哪些订阅者去做相应的逻辑处理

派发更新

queueWatcher 这个函数有个优化点 就是针对数据改变都触发的watcher， 而是把这些watcher先添加到一个队列中，然后在nextTick后运行flushSchedulerQueue

update 后 watcher 推到 nextTick()做了 flushSchedulerQueue

其中设置has对象保证同一个watcher只添加一次，接着对flushing的判断

flushSchedulerQueue这个函数主要做了
队列排序：
 queue.sort((a, b) => a.id - b.id)

1. 组件的更新由父到子；因为父组件的创建过程是先于子的，所以 watcher 的创建也是先父后子，执行顺序也应该保持先父后子。

2. 用户的自定义 watcher 要优先于渲染 watcher 执行；因为用户自定义 watcher 是在渲染 watcher 之前创建的。

3. 如果一个组件在父组件的 watcher 执行期间被销毁，那么它对应的 watcher 执行都可以被跳过，所以父组件的 watcher 应该先执行。

队列遍历
在对queue 排序后，接着就是要对它进行遍历，拿到响应的watcher， 进行water.run 
class Watcher{

	run(){
	   this.getAndInvoke(this.cb)
	  getAndInvoke(){
		get() {
			如果满足新旧值不等、新值是对象类型、deep 模式任何一个条件，则执行 watcher 的回调，注意回调函数执行的时候会把第一个和第二个参数传入新值 value 和旧值 oldValue，这就是当我们添加自定义 watcher 的时候能在回调函数的参数中拿到新旧值的原因。}
		}
	}

}

updateComponent = () => {
  vm._update(vm._render(), hydrating)
}

nexttick 是vue的一个核心：

1. 所有的同步任务都在主线程上，形成一个任执行栈
2. 主线程之外，还存在一个任务队列，只要异步任务又了运行结果，就在任务队列中放置一个事件
3. 一旦执行栈中所有同步任务执行完毕，系统就会读取“任务队列”，那些对应的异步任务，于是结束等待状态，执行执行栈， 开始执行。

 macro task 结束后，都要清空所有的 micro task。

for (macroTask of macroTaskQueue) {

    // 1. Handle current MACRO-TASK
    handleMacroTask(); 
      
    // 2. Handle all MICRO-TASK
    for (microTask of microTaskQueue) {
        handleMicroTask(microTask); 
    }

}

setimmeti
messagechannel

promise

observer

setImmediate

callback.push(cb)

if(){

} else {

}

flushcallbash

总结； nextTick是把要执行的任务推到一个队列中，在下一个tick 同步执行

数据改变后出发渲染watcher 的update，但是watcher的flush是在nextTick后，所以重新渲染是异步的。

监测数据变化不能被检测到

vue.set(this.msg, ‘a ’, ‘vue’)

vue.set(this.items, 1, 3)

vue.set = set

对target 做判断

ob = target.__obj

if(!ob){

target[key] = val; 
return val
}

defineReactive(ob.value, key, val)
ob.dep.notify()// 重点 调用watcher 去重新渲染

如果发现observer
if(childOb){
childOb.dep.depend(); //做依赖收集
}

def(arrayMethod)

const methodsToPatch = [
  'push', 
  'pop', 
  'shift', 
  'unshift', 
  'splice', 
  'sort', 
  'reverse'
]

const original = arrayProto[method]

if(inserted) ob.observeArray(inserted)

ob.dep.notify(); 

vue.set 手动触发wathcer 做渲染

数组del

计算属性的数据原理：
vm._computedWatchers
for(key in computed){

	userDef.get
	watchers[key] = new Watcher()

}

defineComputed(){

	

}
createComputedGetter(){

	if(watcher){
	watcher.depend()
		return watcher.evaluate
	}

}

get(){

	this.getter.call

}

this.getAndInvoke(()=>{

	this.dep.notify();

})

侦听属性 配置方法：

编译 template 到render

编译入口：
if (!options.render) {

}

createCompiler = createCompilerCreate(){}

最终调用的是createCompileToFunctionFn(compile){

	return compileToFunctions(template, options){
	}

}

先做cache 接着
const compiler = compile(template, options)
生成render
createCompiler = createCompilerCreator(function baseCompile 

  const ast = parse(template.trim(),  options)
  if (options.optimize !== false) {
    optimize(ast,  options)
  }
  const code = generate(ast,  options)
  return {
    ast, 
    render: code.render, 
    staticRenderFns: code.staticRenderFns
  }

event 的实现原理

dom事件和自定义事件的区别

parse  ast 树 processAttrs
el.hasBindings = true 生成动态节点
modifilers = parseModifilers(name)

addhandler 添加native 或者event属性

genHandlers 

modifiercode  stop:”$event.stopPropagation”、prevent等

  if (el.events) {
    data +=  `${genHandlers(el.events, false)},` 
  }
  if (el.nativeEvents) {
    data +=  `${genHandlers(el.nativeEvents, true)},` 
  }

data最终的表现形式是:”{on:{“click”:function($event){clickHanle($event)}”

  for (const name in events) {
    const handlerCode = genHandler(events[name])
    if (events[name] && events[name].dynamic) {
      dynamicHandlers +=  `${name},${handlerCode},` 
    } else {
      staticHandlers +=  `"${name}":${handlerCode},` 
    }
  }

拼接出json对象

vue 支持原生事件 和 dom事件
platformModules createPatchFunction 的时候
遍历我们的hooks 
invokeCreateHook 时机

1. 在createChildren
2. 创建组件的时候

invokeUpdateHook 

这两个都会执行 updateDomListeners 方法
判断： oldVnode 是不是都有on属性
nomalizeEvent
updateListener(){ //重点 

	on:Object,
	oldOn:object,
	remove: Function,
	vm:Component

}

dom 的更新强制走的是withMacroTask

export function noop (a?: any,  b?: any,  c?: any) {}

target.addEventListener  最后是对我们的dom做事件绑定
更新的话：
if(cur !== old){
old.fs = cur; 
on[name] = old; 
}

定义的.nativeOn是Dom原生事件：
const listeners = data.on
data.on = data.nativeOn

普通事件只有自定义事件： 
on
eventsMixin

Vue.prototype.$on = function(){}

Vue.prototype.$once = function (){

}

Vue.prototype.$off = function(){}

Vue.prototype.$emit = function(){}

每个事件名都对应一个数组
(vm._event[event] || (vm._events[event] = []) ).push(fn)

在进行事件派发 对事件名下的所有事件进行操作
function createFnInvoker(fn){
  var arguments$1 = arguments; 
  var fns = invoker.fns; 
  if(Array.isArray(fns)){
  }
 invoker.fns = fns; 
  return invoker
}
我们对于同一个事件，可能会注册多个侦听器，也就是多个回调函数 例如$on

this.$emit 往当前子组件派发事件
有个幻觉就是在父元素上面做监听 
实际上是在子组件自身的实例上

自定义对象
组件节点中 on
vue 自定义事件 就是一个典型的自定义事件中心

总结：
event在编译阶段生成相关的data， 对于Dom事件在patch过程中的创建阶段和更新阶段执行updateDOMListeners生成DOM事件；对于自定义事件，会在组件初始化阶段通过initEvent创建

原生DOM事件和自定义事件主要的区别在于添加和删除事件的方式不一样，并且自定义事件的派发是往实例上派发，但是可以利用父组件环境定义回调函数来实现父子组件的通讯

v-model  

addDirective 生成directiv属性

对浏览器的原生事件
select  input radio checkbox  texttarea

addProps(el, ‘value’, ‘$(${value})’)

addHandle(el, event, code , null, true) // 添加语法糖

注释例子：
:value=‘message’
@input=“message=$event.target.value”

所以在v-model 定义后 不能爱在props上定义

他们的区别： 中文事件

directive 会有一个inserted事件

expression  变现， 表达，态度
normalize  正常的
primitive  原始
strat  策略/战略
pascalcase 大驼峰
kebab-case (短横线分隔命名) 
modifier 修饰符
invoke  援用，援引 

slot:
组件没有包含 slot 的话，组件起始标签和结束标签之间的任何内容都会被抛弃 

父级模版里的所有内容都是在父级作用域中编译的；子模版里的所有内容都是在子作用域中编译的。

