# 原理

## 合并配置

```JS
function normalizeProps (options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
        val = props[key]
        name = camelize(key)
        res[name] = isPlainObject(val)
          ? val
          : { type: val }
      }
    }
}
```

判断props 是不是数组， 在进行驼峰化， 数组形式我们 type 都设置为null

## 初始化

```JS
function initProps (vm: Component, propsOptions: Object) {
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
        if (!isRoot && !isUpdatingChildComponent) {
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
    
```

主要做三件事情， 校验props  生成响应式 defineReactive

```JS
// call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
```

只针对对象和数组类型的 prop，要求必须是一个工厂函数，它的值是工厂函数返回的值，所以要执行。
对于函数类型的 prop，那么它的值就是这个函数本身，所以不需要执行。
如果直接返回对象，那么多个组件实例的相应的默认 prop 值会共享这个对象，一旦修改这个对象，则会影响所有实例，是不符合预期的。

子组件重新渲染 分为props发生改变 或者内部属性发生变动

在构造函数初始化过程中进行proxy

```JS
function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}
```

## props 更新

子组件创建的时候会触发 prepatch 方法

```js
  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  }
```

接着我们看 lifecycle 里面的

```JS
  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false)
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      const propOptions: any = vm.$options.props // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm)
    }
    toggleObserving(true)
    // keep a copy of raw propsData
    vm.$options.propsData = propsData
  }
```

因为data 初始化数据会保护props， 所以在extend 的时候 props 是不会参与初始化求值的， 所以不能在 extend 的时候 proxy

vue 的优化 只递归父 props 对象 defineReactive， 没有处理子 props。

toggleObserving 在响应式中的优化

defineReactive(props)是为了给值类型用哦？
值类型props变化触发重新渲染执行 patchVnode ==>updateComponent，改变值类型props值触发setter。
对象类型props属性变化不会触发父组件的重新渲染也就不会触发updateComponent，直接通过访问的对象属性dep通知子组件watcher更新了
