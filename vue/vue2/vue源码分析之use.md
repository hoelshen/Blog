# vue 源码分析之 use

## 用法

如果vue安装的组件类型必须为 Function 或者是 Object

如果是个对象，必须提供 install 方法

如果是一个函数，会被直接当作install函数执行

``` js
  vue.use(plugin, arguments)


```

建议组件采用第一种写法, 当采用第二种写法时, this 指针指向 null.

```js
  if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
  }
```

通常我们都会为插件写 install 方法，

## 官方 use 源码

``` js
import {
    toArray
} from '../util/index'

export function initUse(Vue: GlobalAPI) {
    Vue.use = function(plugin: Function | Object) {
        // 限制了自定义组建的类型
        const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
        //保存注册组件的数组，不存在及创建
        if (installedPlugins.indexOf(plugin) > -1) {
            //判断该组件是否注册过，存在return Vue对象
            return this
        }
        //调用 `toArray` 方法
        const args = toArray(arguments, 1) // 把类似数组的对象转化成真正的数组
        args.unshift(this)  //向前添加 this 到 args 
        // install 的传递的参数有关系, 第一个参数是 vue 构造器, 第二个参数是一个可选的选项 options
        //将Vue对象拼接到数组头部
        if (typeof plugin.install === 'function') {
            //如果组件是对象，且提供install方法，调用install方法将参数数组传入，改变 `this` 指针为该组件
            plugin.install.apply(plugin, args)
        } else if (typeof plugin === 'function') {
            //如果传入组件是函数，这直接调用，但是此时的 `this` 指针指向为 `null`
            plugin.apply(null, args)
        }
        //在保存注册组件的数组中添加
        installedPlugins.push(plugin)
        return this
    }
}
```

toArray 方法源码

```js
export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
//将存放参数的数组转为数组，并除去第一个参数（该组件）
  const ret: Array<any> = new Array(i)
//循环拿出数组
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}
```

## 为什么 Vue-Router Vuex ElementUI 的时候需要 vue.use(). 而引入 axios 的时候,不需要 Vue.use()

Vue-Router、Vuex、ElementUI三者都具有install方法，并且插件的运行依赖于install方法里的一些操作，才能正常运行，而axios没有install方法也能正常运行。

Element 中的 install

```js
const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);
	// components是ElementUI的组件数组，里面有Dialog、Input之类的组件
 // 往Vue上面挂载组件
  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(Loading.directive);
// 自定义一些参数
  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };
// 在Vue原型上注册一些方法，这就是为什么我们可以直接使用this.$alert、this.$loading的原因，值就是这么来的。
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

};
```

Vue-Route 中的 install

我们先把这个 install 方法的部分拆解出来

```js
import View from './components/view'
import Link from './components/link'

export let _Vue

export function install (Vue) {
  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }
  Vue.mixin({
    beforeCreate () {
      // 如果该组件是根组件
      if (isDef(this.$options.router)) {
	      //  设置根组件叫_routerRoot
        this._routerRoot = this
        // 根组件的_router属性为，new Vue传进去的router
        // $options是在mains.js中，new Vue里的参数，在这里我们传入的参数，
        this._router = this.$options.router
        this._router.init(this)
        // 通过defineReactive方法，来把this._router.history.current变成响应式的，这个方法的底层就是object.defineProperty
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 如果该组件不是根组件，那么递归往上找，直到找到根组件的。
        // 因为 Vue 渲染组件是先渲染根组件，然后渲染根组件的子组件啊，然后再渲染孙子组件。
        // 结果就是每一个组件都有 this._routerRoot 属性，该属性指向了根组件。
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
// 把自身$router代理为this._routerRoot（根组件的）的_router
// 根组件的_router,就是new Vue传入的 router
// 这样就实现了，每一个Vue组件都有$router、$route属性
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
// 同理，这样就是把自身的$route，代理到根组件传入的route
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
	// 注册 <router-view>组件
  Vue.component('RouterView', View)
	// 注册<router-link>组件
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```

全局注册 RouterView、RouterLink 组件

通过 minxi 混入的方式，如果自身是根组件，就把根组件的_router属性映射为new Vue传入的router实例(this.$options.router)。
如果自身不是根组件，那么层层往上找，直到找到根组件，并用_routerRoot标记出根组件。
为每一个组件代理$router、$route属性，这样每一个组件都可以去到$router、$route。
注册<router-link>、<router-view>组件

为什么axios不需要安装，可以开箱即用？
其实理由也很简单，跟上面需要install的相反的。因为axios是基于Promise封装的库，是完全独立于Vue的，根本不需要挂载在Vue上也能实现发送请求。
而因为VueRouter需要为我们提供$router、$routers之类的属性，要依赖与Vue或者操作Vue实例才能实现。
Vue.use实际上就是Vue实例与插件的一座桥梁。

## 参考文献

[Vue.use](https://juejin.im/post/6844903946343940104)