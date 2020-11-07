# event 的实现原理

dom 事件和自定义事件的区别

parse 阶段处理 ast 树 时 有 processAttrs 方法

``` JS
function processAttrs(el) {
    const list = el.attrsList
    let i, l, name, rawName, value, modifiers, isProp
    for (i = 0, l = list.length; i < l; i++) {
        name = rawName = list[i].name
        value = list[i].value
        if (dirRE.test(name)) {
            el.hasBindings = true
            modifiers = parseModifiers(name)
            if (modifiers) {
                name = name.replace(modifierRE, '')
            }
            if (bindRE.test(name)) {
                // ..
            } else if (onRE.test(name)) {
                name = name.replace(onRE, '')
                addHandler(el, name, value, modifiers, false, warn)
            } else {
                // ...
            }
        } else {
            // ...
        }
    }
}
```

el.hasBindings = true 生成动态节点
modifilers = parseModifilers(name)

addhandler 添加 native 或者event属性

``` JS
genHandlers

modifiercode stop: ”$event.stopPropagation”、 prevent等

if (el.events) {
    data += `${genHandlers(el.events, false)},`
}
if (el.nativeEvents) {
    data += `${genHandlers(el.nativeEvents, true)},`
}
```

data最终的表现形式是:

``` JS
”
{
    on: {
        “
        click”: function($event) {
            clickHanle($event)
        }”

        for (const name in events) {
            const handlerCode = genHandler(events[name])
            if (events[name] && events[name].dynamic) {
                dynamicHandlers += `${name},${handlerCode},`
            } else {
                staticHandlers += `"${name}":${handlerCode},`
            }
        }
```

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
```JS
updateListener(){ //重点 
	on:Object,
	oldOn:object,
	remove: Function,
	vm:Component
}
```
dom 的更新强制走的是withMacroTask

``` JS
export function noop(a ? : any, b ? : any, c ? : any) {}

target.addEventListener 最后是对我们的dom做事件绑定
更新的话：
if (cur !== old) {
    old.fs = cur;
    on[name] = old;
}
```

定义的.nativeOn是Dom原生事件：

``` JS
const listeners = data.on
data.on = data.nativeOn
```

普通事件只有自定义事件： 

``` JS
on
eventsMixin

Vue.prototype.$on = function() {}

Vue.prototype.$once = function() {

}

Vue.prototype.$off = function() {}

Vue.prototype.$emit = function() {}
```

每个事件名都对应一个数组
(vm._event[event] || (vm._events[event] = []) ).push(fn)

在进行事件派发 对事件名下的所有事件进行操作

``` JS
function createFnInvoker(fn) {
    var arguments$1 = arguments;
    var fns = invoker.fns;
    if (Array.isArray(fns)) {}
    invoker.fns = fns;
    return invoker
}
```

我们对于同一个事件，可能会注册多个侦听器，也就是多个回调函数 例如$on

this.$emit 往当前子组件派发事件
有个幻觉就是在父元素上面做监听 
实际上是在子组件自身的实例上

自定义对象
组件节点中 on
vue 自定义事件 就是一个典型的自定义事件中心

```JS
export function eventsMixin (Vue: Class<Component>) {
  const hookRE = /^hook:/
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn)
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }

  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    function on () {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }

  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // all
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    if (fn) {
      // specific handler
      let cb
      let i = cbs.length
      while (i--) {
        cb = cbs[i]
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1)
          break
        }
      }
    }
    return vm
  }

  Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      for (let i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args)
        } catch (e) {
          handleError(e, vm, `event handler for "${event}"`)
        }
      }
    }
    return vm
  }
}

```

非常经典的事件中心的实现，把所有的事件用 vm._events 存储起来，当执行 vm.$on(event,fn) 的时候，按事件的名称 event 把回调函数 fn 存储起来 vm._events[event].push(fn)。当执行 vm.$emit(event) 的时候，根据事件名 event 找到所有的回调函数 let cbs = vm._events[event]，然后遍历执行所有的回调函数。当执行 vm.$off(event,fn) 的时候会移除指定事件名 event 和指定的 fn 当执行 vm.$once(event,fn) 的时候，内部就是执行 vm.$on，并且当回调函数执行一次后再通过 vm.$off 移除事件的回调，这样就确保了回调函数只执行一次。


总结：
event在编译阶段生成相关的 data， 对于Dom事件在patch过程中的创建阶段和更新阶段执行updateDOMListeners生成DOM事件；对于自定义事件，会在组件初始化阶段通过initEvent创建

原生DOM事件和自定义事件主要的区别在于添加和删除事件的方式不一样，并且自定义事件的派发是往实例上派发，但是可以利用父组件环境定义回调函数来实现父子组件的通讯.

Vue 支持 2 种事件类型，原生 DOM 事件和自定义事件，它们主要的区别在于添加和删除事件的方式不一样，并且自定义事件的派发是往当前实例上派发，但是可以利用在父组件环境定义回调函数来实现父子组件的通讯。另外要注意一点，只有组件节点才可以添加自定义事件，并且添加原生 DOM 事件需要使用 native 修饰符；而普通元素使用 .native 修饰符是没有作用的，也只能添加原生 DOM 事件。
