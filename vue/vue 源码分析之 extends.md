# extends 




## 用法




## 原理


```js
遇到嵌套组件时，首先将子组件转为组件形式的VNode时，会将引入的组件对象使用extend转为子组件的构造函数，作为VNode的一个属性Ctor；然后在将VNode转为真实的Dom的时候实例化这个构造函数；最后实例化完成后手动调用$mount进行挂载，将真实Dom插入到父节点内完成渲染。
```

接受的是一个组件对象，再执行extend时将继承基类构造器上的一些属性、原型方法、静态方法等，最后返回Sub这么一个构造好的子组件构造函数。拥有和vue基类一样的能力，并在实例化时会执行继承来的_init方法完成子组件的初始化。

```js
Vue.extend = function (extendOptions = {}) {
  const Super = this  // Vue基类构造函数
  const name = extendOptions.name || Super.options.name
  
  const Sub = function (options) {  // 定义构造函数
    this._init(options)  // _init继承而来
  }
  
  Sub.prototype = Object.create(Super.prototype)  // 继承基类Vue初始化定义的原型方法
  Sub.prototype.constructor = Sub  // 构造函数指向子类
  Sub.options = mergeOptions( // 子类合并options
    Super.options,  // components, directives, filters, _base
    extendOptions  // 传入的组件对象
  )
  Sub['super'] = Super // Vue基类

  // 将基类的静态方法赋值给子类
  Sub.extend = Super.extend
  Sub.mixin = Super.mixin
  Sub.use = Super.use

  ASSET_TYPES.forEach(function (type) { // ['component', 'directive', 'filter']
    Sub[type] = Super[type]
  })
  
  if (name) {  让组件可以递归调用自己，所以一定要定义name属性
    Sub.options.components[name] = Sub  // 将子类挂载到自己的components属性下
  }

  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions

  return Sub  // 返回子组件的构造函数
}
```

实例化Sub

```js
Vue.prototype._init = function(options) {  // 初始化
  ...
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm)
  initState(vm)
  initProvide(vm)
  callHook(vm, 'created')  // 初始化阶段完成
  ...
  
  if (vm.$options.el) {  // 开始挂载阶段
    vm.$mount(vm.$options.el)  // 执行挂载
  }
}
```