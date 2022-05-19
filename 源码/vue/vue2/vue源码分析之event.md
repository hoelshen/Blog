# event 的实现原理(事件的实现原理)

修饰符：

* .stop: 调用event.stopPropagation()，即阻止事件冒泡。
* .prevent: 调用event.preventDefault()，即阻止默认事件。
* .capture: 添加事件侦听器时使用capture模式，即使用事件捕获模式处理事件。
* .native: 监听组件根元素的原生事件，即注册组件根元素的原生事件而不是组件自定义事件的。
* .once: 只触发一次回调
* .self: 只当事件是从侦听器绑定的元素本身触发时才触发回调。
* .{keyCode | keyAlias}: 只当事件是从特定键触发时才触发回调。
*.left(2.2.0): 只当点击鼠标左键时触发。
*.right(2.2.0): 只当点击鼠标右键时触发。
*.middle(2.2.0): 只当点击鼠标中键时触发。
*.passive(2.3.0): 以{ passive: true }模式添加侦听器，表示listener永远不会调用preventDefault()。
*.sync(2.6.0):

<https://zhuanlan.zhihu.com/p/441130756>

.capture 捕获

```JS
        <div id="obj1" v-on:click.capture="doc">
            obj1
            <div id="obj2" v-on:click.capture="doc">
                obj2
                <div id="obj3" v-on:click="doc">
                    obj3
                    <div id="obj4" v-on:click="doc">
                        obj4
                        <!--。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。点击obj4的时候，弹出的顺序为：obj1、obj2、obj4、obj3；
                由于1，2有修饰符，故而先触发事件，然后就是4本身触发，最后冒泡事件。
                -->
                    </div>
                </div>
            </div>
        </div>
```

  1. 冒泡是从里往外冒，捕获是从外往里捕。

  2. 当捕获存在时，先从外到里的捕获，剩下的从里到外的冒泡输出。

即是给元素添加一个监听器，当元素发生冒泡时，先触发带有该修饰符的元素。若有多个该修饰符，则由外而内触发。
就是谁有该事件修饰符，就先触发谁。

## dom 事件和自定义事件的区别

parse 阶段处理 ast 树 时 有 processAttrs 方法

``` JS
function processAttrs(el) {
    const list = el.attrsList
    let i, l, name, rawName, value, modifiers, isProp
    for (i = 0, l = list.length; i < l; i++) {
        name = rawName = list[i].name
        value = list[i].value
        if (dirRE.test(name)) {
            // mark element as dynamic
            el.hasBindings = true
            // modifiers
            modifiers = parseModifiers(name) // 将修饰符解析
            if (modifiers) {
                name = name.replace(modifierRE, '')
            }
            if (bindRE.test(name)) { // v-bind 处理v-bind的情况
                // ..
            } else if (onRE.test(name)) { // v-on // 处理事件绑定
                name = name.replace(onRE, '')// 将事件名匹配
                addHandler(el, name, value, modifiers, false, warn, list[i], isDynamic) // 处理时间手机
            } else {
                // ...
            }
        } else {
            // ...
        }
    }
}
```

通过addHandler 方法，为AST树添加事件相关的属性以及对事件修饰符进行处理

```javascript
// dev/src/compiler/helpers.js line 69
export function addHandler (
  el: ASTElement,
  name: string,
  value: string,
  modifiers: ?ASTModifiers,
  important?: boolean,
  warn?: ?Function,
  range?: Range,
  dynamic?: boolean
) {
  modifiers = modifiers || emptyObject
  // passive 和 prevent 不能同时使用，具体是由passive模式的性质决定的
  // 详细可以参阅 https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.',
      range
    )
  }
  // 标准化click.right和click.middle，因为它们实际上不会触发。
  // 从技术上讲，这是特定于浏览器的，但是至少目前来说，浏览器是唯一具有右键/中间点击的目标环境。
  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (modifiers.right) { // 将鼠标右键点击标准化 右键点击默认的是 contextmenu 事件
    if (dynamic) { // 如果是动态事件
      name = `(${name})==='click'?'contextmenu':(${name})` // 动态确定事件名
    } else if (name === 'click') { // 如果不是动态事件且是鼠标右击
      name = 'contextmenu' // 则直接替换为contextmenu事件
      delete modifiers.right // 删除modifiers的right属性
    }
  } else if (modifiers.middle) { // 同样标准化处理鼠标中键点击的事件
    if (dynamic) { // 如果是动态事件
      name = `(${name})==='click'?'mouseup':(${name})` // 动态确定事件名
    } else if (name === 'click') { // 如果不是动态事件且是鼠标中键点击
      name = 'mouseup' // 处理为mouseup事件
    }
  }
  // 下面是对捕获、一次触发、passive模式的modifiers处理，主要是为事件添加 !、~、& 标记
  // 这一部分标记可以在Vue官方文档中查阅 
  // https://cn.vuejs.org/v2/guide/render-function.html#%E4%BA%8B%E4%BB%B6-amp-%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6
  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture
    name = prependModifierMarker('!', name, dynamic)
  }
  if (modifiers.once) {
    delete modifiers.once
    name = prependModifierMarker('~', name, dynamic)
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive
    name = prependModifierMarker('&', name, dynamic)
  }
  
  // events 用来记录绑定的事件
  let events
  if (modifiers.native) { // 如果是要触发根元素原生事件则直接取得nativeEvents
    delete modifiers.native
    events = el.nativeEvents || (el.nativeEvents = {})
  } else { // 否则取得events
    events = el.events || (el.events = {})
  }
    
  // 将事件处理函数作为handler
  const newHandler: any = rangeSetItem({ value: value.trim(), dynamic }, range)
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers
  }

 // 绑定的事件可以多个，回调也可以多个，最终会合并到数组中
  const handlers = events[name]
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler)
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
  } else {
    events[name] = newHandler
  }

  el.plain = false
}
```

接下来需要将AST语法树转render函数，在这个过程中会加入对事件的处理，首先模块导出了generate函数，generate函数即会返回render字符串，在这之前会调用genElement函数，而在上述addHandler方法处理的最后执行了el.plain = false，这样在genElement函数中会调用genData函数，而在genData函数中即会调用genHandlers函数。

generate

```javascript
// dev/src/compiler/codegen/index.js line 42
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`, // 即render字符串
    staticRenderFns: state.staticRenderFns
  }
}
```

genElement

```javascript
// dev/src/compiler/codegen/index.js line 55
export function genElement (el: ASTElement, state: CodegenState): string {
    // ...
    let code
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      let data
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData(el, state)
      }

      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // ...
}

```

genHandlers

``` JS
// modifiercode stop: ”$event.stopPropagation”、 prevent等

export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'
  // ...
  // event handlers
  if (el.events) {
    data += `${genHandlers(el.events, false)},`
  }
  if (el.nativeEvents) {
    data += `${genHandlers(el.nativeEvents, true)},`
  }
  // ...
  data = data.replace(/,$/, '') + '}'
  // ...
  return data
}

```

data最终的表现形式是:

``` JS
{
  on: {
      "click": function($event) {
          clickHanle($event)
      }

      for(const name in events) {
          const handlerCode = genHandler(events[name])
          if (events[name] && events[name].dynamic) {
              dynamicHandlers += `${name},${handlerCode},`
          } else {
              staticHandlers += `"${name}":${handlerCode},`
          }
      }
  }
}
```

可以看到无论是处理普通元素事件还是组件根元素原生事件都会调用genHandlers函数，genHandlers函数即会遍历解析好的AST树中事件属性，拿到event对象属性，并根据属性上的事件对象拼接成字符串。

事件绑定

前面介绍了如何编译模板提取事件收集指令以及生成render字符串和render函数，但是事件真正的绑定到DOM上还是离不开事件注册，此阶段就发生在patchVnode过程中，在生成完成VNode后，进行patchVnode过程中创建真实DOM时会进行事件注册的相关钩子处理。

```JS
// dev/src/core/vdom/patch.js line 33
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

// dev/src/core/vdom/patch.js line 125
function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
  // ...
  if (isDef(data)) {
    invokeCreateHooks(vnode, insertedVnodeQueue)
  }
  // ...
}

// dev/src/core/vdom/patch.js line 303
// 在之前cbs经过处理 
// 这里cbs.create包含如下几个回调：
// updateAttrs、updateClass、updateDOMListeners、updateDOMProps、updateStyle、update、updateDirectives
function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (let i = 0; i < cbs.create.length; ++i) {
      cbs.create[i](emptyNode, vnode)
    }
    i = vnode.data.hook // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) i.create(emptyNode, vnode)
      if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
    }
}
```

invokeCreateHooks就是一个模板指令处理的任务，他分别针对不同的指令为真实阶段创建不同的任务，针对事件，这里会调updateDOMListeners对真实的DOM节点注册事件任务。

```javascript
// dev/src/platforms/web/runtime/modules/events.js line 105
function updateDOMListeners (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {  // on是事件指令的标志
    return
  }
  // 新旧节点不同的事件绑定解绑
  const on = vnode.data.on || {}
  const oldOn = oldVnode.data.on || {}
  // 拿到需要添加事件的真实DOM节点
  target = vnode.elm
  // normalizeEvents是对事件兼容性的处理
  normalizeEvents(on)
  // 调用updateListeners方法，并将on作为参数传进去
  updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context)
  target = undefined
}

// dev/src/core/vdom/helpers/update-listeners.js line line 53
export function updateListeners (
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  createOnceHandler: Function,
  vm: Component
) {
  let name, def, cur, old, event
  for (name in on) { // 遍历事件
    def = cur = on[name]
    old = oldOn[name]
    event = normalizeEvent(name)
    /* istanbul ignore if */
    if (__WEEX__ && isPlainObject(def)) {
      cur = def.handler
      event.params = def.params
    }
    if (isUndef(cur)) { // 事件名非法的报错处理
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid handler for event "${event.name}": got ` + String(cur),
        vm
      )
    } else if (isUndef(old)) { // 旧节点不存在
      if (isUndef(cur.fns)) { // createFunInvoker返回事件最终执行的回调函数
        cur = on[name] = createFnInvoker(cur, vm)
      }
      if (isTrue(event.once)) {  // 只触发一次的事件
        cur = on[name] = createOnceHandler(event.name, cur, event.capture)
      }
      // 执行真正注册事件的执行函数
      add(event.name, cur, event.capture, event.passive, event.params)
    } else if (cur !== old) {
      old.fns = cur
      on[name] = old
    }
  }
  for (name in oldOn) { // 旧节点存在，解除旧节点上的绑定事件
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      // 移除事件监听
      remove(event.name, oldOn[name], event.capture)
    }
  }
}

// dev/src/platforms/web/runtime/modules/events.js line 32
// 在执行完回调之后，移除事件绑定
function createOnceHandler (event, handler, capture) {
  const _target = target // save current target element in closure
  return function onceHandler () {
    const res = handler.apply(null, arguments)
    if (res !== null) {
      remove(event, onceHandler, capture, _target)
    }
  }
}
```

最终添加和移除事件都是调用add与remove方法，最终调用的方法即dom的addEventListener和removeEventListener方法。

```javascript
// dev/src/platforms/web/runtime/modules/events.js line 46
function add (
  name: string,
  handler: Function,
  capture: boolean,
  passive: boolean
) {
  // async edge case #6566: inner click event triggers patch, event handler
  // attached to outer element during patch, and triggered again. This
  // happens because browsers fire microtask ticks between event propagation.
  // the solution is simple: we save the timestamp when a handler is attached,
  // and the handler would only fire if the event passed to it was fired
  // AFTER it was attached.
  if (useMicrotaskFix) {
    const attachedTimestamp = currentFlushTimestamp
    const original = handler
    handler = original._wrapper = function (e) {
      if (
        // no bubbling, should always fire.
        // this is just a safety net in case event.timeStamp is unreliable in
        // certain weird environments...
        e.target === e.currentTarget ||
        // event is fired after handler attachment
        e.timeStamp >= attachedTimestamp ||
        // bail for environments that have buggy event.timeStamp implementations
        // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
        // #9681 QtWebEngine event.timeStamp is negative value
        e.timeStamp <= 0 ||
        // #9448 bail if event is fired in another document in a multi-page
        // electron/nw.js app, since event.timeStamp will be using a different
        // starting reference
        e.target.ownerDocument !== document
      ) {
        return original.apply(this, arguments)
      }
    }
  }
  target.addEventListener(
    name,
    handler,
    supportsPassive
      ? { capture, passive }
      : capture
  )
}

// dev/src/platforms/web/runtime/modules/events.js line 92
function remove (
  name: string,
  handler: Function,
  capture: boolean,
  _target?: HTMLElement
) {
  (_target || target).removeEventListener(
    name,
    handler._wrapper || handler,
    capture
  )
}
```

dom 的更新强制走的是withMacroTask

``` JS
export function noop(a ? : any, b ? : any, c ? : any) {}

target.addEventListener // 最后是对我们的dom做事件绑定
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

```JS
Vue.prototype.$on = function() {}

Vue.prototype.$once = function() {

}

Vue.prototype.$off = function() {}

Vue.prototype.$emit = function() {}
```

每个事件名都对应一个数组
(vm._event[event] || (vm._events[event] = []) ).push(fn)

在进行事件派发 对事件名下的所有事件进行操作

```JS
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

### 自定义对象

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
event 在编译阶段生成相关的 data， 对于 Dom 事件在 patch 过程中的创建阶段和更新阶段执行 updateDOMListeners 生成 DOM 事件；对于自定义事件，会在组件初始化阶段通过 initEvent 创建

Vue 支持 2 种事件类型，原生 DOM 事件和自定义事件，它们主要的区别在于添加和删除事件的方式不一样，并且自定义事件的派发是往当前实例上派发，但是可以利用在父组件环境定义回调函数来实现父子组件的通讯。另外要注意一点，只有组件节点才可以添加自定义事件，并且添加原生 DOM 事件需要使用 native 修饰符；而普通元素使用 .native 修饰符是没有作用的，也只能添加原生 DOM 事件。
