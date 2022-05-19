# 响应式原理

## init_state

``` JS
export function initState(vm: Component) {
    vm._watchers = []
    const opts = vm.$options
    if (opts.props) initProps(vm, opts.props)
    if (opts.methods) initMethods(vm, opts.methods)
    if (opts.data) {
        initData(vm)
    } else {
        observe(vm._data = {}, true /* asRootData */ )
    }
    if (opts.computed) initComputed(vm, opts.computed)
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch)
    }
}
```

state 里面会做 options 接收函数判断：

``` js

1. props initProps
2. methods initMethods
3. data

if () {
    initData(vm)
} else {
    oberve vm._data = {}, true
}

4. computed
5. watch

```

为什么我们能够在mouted直接访问到 this.xxx，因为 proxy 做了一层代理(vm, _data, {xxx})

## 响应式对象

Vue会把 props、data 等变成响应式对象，在创建过程中，若发现子属性也为对象则递归把该对象变成响应式
props 初始化 遍历配置

``` JS
function initProps(vm: Component, propsOptions: Object) {
    const propsData = vm.$options.propsData || {}
    const props = vm._props = {}
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    const keys = vm.$options._propKeys = []
    const isRoot = !vm.$parent
    // root instance props should be converted
    if (!isRoot) {
        toggleObserving(false)
    }
    for (const key in propsOptions) {
        keys.push(key)
        const value = validateProp(key, propsOptions, propsData, vm)
        /* istanbul ignore else */
        if (process.env.NODE_ENV !== 'production') {
            const hyphenatedKey = hyphenate(key)
            if (isReservedAttribute(hyphenatedKey) ||
                config.isReservedAttr(hyphenatedKey)) {
                warn(
                    `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
                    vm
                )
            }
            defineReactive(props, key, value, () => {
                if (vm.$parent && !isUpdatingChildComponent) {
                    warn(
                        `Avoid mutating a prop directly since the value will be ` +
                        `overwritten whenever the parent component re-renders. ` +
                        `Instead, use a data or computed property based on the prop's ` +
                        `value. Prop being mutated: "${key}"`,
                        vm
                    )
                }
            })
        } else {
            defineReactive(props, key, value)
        }
        // static props are already proxied on the component's prototype
        // during Vue.extend(). We only need to proxy props defined at
        // instantiation here.
        if (!(key in vm)) {
            proxy(vm, `_props`, key)
        }
    }
    toggleObserving(true)
}
```

1. 调用defineReactive把 props 对应的值变成响应式的, vm._props.xxx定义到 props 对应属性
2. vm._props.xxx 的访问代理到 vm.xxx

initdata 同理

``` JS
function initData(vm: Component) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ?
        getData(data, vm) :
        data || {}
    if (!isPlainObject(data)) {
        data = {}
        process.env.NODE_ENV !== 'production' && warn(
            'data functions should return an object:\n' +
            'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
            vm
        )
    }
    // proxy data on instance
    const keys = Object.keys(data)
    const props = vm.$options.props
    const methods = vm.$options.methods
    let i = keys.length
    while (i--) {
        const key = keys[i]
        if (process.env.NODE_ENV !== 'production') {
            if (methods && hasOwn(methods, key)) {
                warn(
                    `Method "${key}" has already been defined as a data property.`,
                    vm
                )
            }
        }
        if (props && hasOwn(props, key)) {
            process.env.NODE_ENV !== 'production' && warn(
                `The data property "${key}" is already declared as a prop. ` +
                `Use prop default value instead.`,
                vm
            )
        } else if (!isReserved(key)) {
            proxy(vm, `_data`, key)
        }
    }
    // observe data
    observe(data, true /* asRootData */ )
}
```

1.vm._data.xxx代理到vm.xxx
2.observe观察data 变成响应式的

### proxy

代理的作用是把 props 和 data 上的属性代理到 vm 实例上

proxy代码如下：

``` JS
const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}
export function proxy(target: Object, sourceKey: string, key: string) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

proxy 方法的实现很简单，通过 Object.defineProperty 把 target[sourceKey][key] 的读写变成了对 target[key] 的读写

## observe

observe 方法的作用就是给非 VNode 的对象类型数据添加一个 Observer

``` JS
export function observe(value: any, asRootData: ? boolean): Observer | void {
    if (!isObject(value) || value instanceof VNode) {
        return
    }
    let ob: Observer | void
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else if (
        shouldObserve &&
        !isServerRendering() &&
        (Array.isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value._isVue
    ) {
        ob = new Observer(value)
    }
    if (asRootData && ob) {
        ob.vmCount++
    }
    return ob
}
```

### Observer

Observer是一个类， 作用是给对象添加属性 getter 和 setter, 用于依赖收集和派发更新。
实例化dep对象 接着 def 方法封装 defineProperty  对 __ob__

shouldObserver 控制 Observer()

Observer 对数组调用observerArray
对纯对象执行walk方法。

``` JS
export class Observer {
    value: any;
    dep: Dep;
    vmCount: number; // number of vms that has this object as root $data

    constructor(value: any) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            const augment = hasProto ?
                protoAugment :
                copyAugment
            augment(value, arrayMethods, arrayKeys)
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }
    observeArray(items: Array < any > ) {

        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }

    }

    walk(obj: Object) {

        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }

    }
```

object.keys 拿到的是不可枚举的

defineReactive函数 getOwnPropertyDescriptor

``` JS
/**
 * Define a property.
 */
export function def(obj: Object, key: string, val: any, enumerable ? : boolean) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}
```

依赖收集 reactiveGetter
export function defineReactive (
」
setter 的逻辑有 2 个关键的点，一个是 childOb = !shallow && observe(newVal)，如果 shallow 为 false 的情况，会对新设置的值变成一个响应式对象；另一个是 dep.notify()

当我们在组件中对响应的数据做了修改，就会触发setter的逻辑-》dep.notify

Dep 是整个 getter 依赖收集的核心

Dep 是一个class， 定义了一些属性和方法

建立数据和watcher的桥梁

``` JS
Dep {
    static target 同一时间只有唯一watcher
    id
    sub
}
notify() {
    // stabilize the subscriber list first

    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update()
    }

}

watcher {
    update() {

        queueWatcher(this)

    }
    addDep() {

        dep.addSub(this)

    }

    cleanupDep() {

        if (!this.newDepIds.has(dep.id)) {
            dep.removeSub(this)
        }

    }
}
```

如果我们没有订阅的话， 即时去修改它 也不会重新渲染。
总结： 依赖收集就是订阅数据变化的 watcher 的收集
依赖收集的目的就是当这些响应式数据发送变化，触发它们的setter的时候， 能知道应该通知哪些订阅者去做相应的逻辑处理

派发更新

queueWatcher 这个函数有个优化点 就是针对数据改变都触发的 watcher， 而是把这些watcher先添加到一个队列中，然后在nextTick后运行flushSchedulerQueue

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

```JS
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
```

nextTick 是vue的一个核心：

1. 所有的同步任务都在主线程上，形成一个任执行栈
2. 主线程之外，还存在一个任务队列，只要异步任务又了运行结果，就在任务队列中放置一个事件
3. 一旦执行栈中所有同步任务执行完毕，系统就会读取“任务队列”，那些对应的异步任务，于是结束等待状态，执行执行栈， 开始执行。

 macro task 结束后，都要清空所有的 micro task。

```JS
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
```

flushcallbash

总结； nextTick是把要执行的任务推到一个队列中，在下一个tick 同步执行

数据改变后出发渲染watcher 的update，但是watcher的flush是在nextTick后，所以重新渲染是异步的。

监测数据变化不能被检测到

```js
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
```

数组del

计算属性的数据原理：

```JS
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
```

侦听属性 配置方法：

编译 template 到render

编译入口：

```js
if (!options.render) {

}

createCompiler = createCompilerCreate(){}
```

最终调用的是

```js
createCompileToFunctionFn(compile){

	return compileToFunctions(template, options){
	}

}
```

```JS
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
```

## 在 lifecycle 中

``` js
vm.$options.render = createEmptyNode
performance 做性能埋点

if (updateComponent) {
    new Watcher(), 在它的回调中调用updateComponent方法， 在此方法中调用vm._render方法 生成node, 最终调用vm.update 更新DOM
}
```

渲染watcher

在定义的watcher 里面 有个

``` js
constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options: ? : ? object,
    isRenderWatcher ? : boolean

) {
    this.vm = vm
    if (isRenderWatcher) {
        vm._watcher = this
    }
    vm._watchers.push(this)
    this.cb = cb
    this.expression = process.env.NODE_ENV !== 'production' ?
        expOrFn.toString() :
        ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
        this.getter = expOrFn
    } else {
        this.getter = parsePath(expOrFn)
    }
}
```

watcher 初始化的时候会执行回调函数，另一个当vm实例中的监测数据发生变化的时候执行回调函数
