# 讲解

## 实现通过方法调用该通知组件

### 继承组件

显示通知的定位
组件的出现和自动消失控制
连续多次调用通知方法，如何排版多个通知
在这个前提下，我们需要扩展该组件，但是扩展的这些属性不能直接放在原组件内，因为这些可能会影响组件在模板内的使用，那怎么办呢？这时候我们就要用到Vue里面非常好用的一个API，extend，通过他去继承原组件的属性并扩展他。

首先通过 const NotificationConstructor = Vue.extend(Component)，我们得到了一个类似于Vue的子类，我们就可以通过new NotificationConstructor({...options})的方式去创建 Vue 的实例了，同时通过该方式创建的实例，是有组件定义里面的所有属性的。

在创建实例之后，可以通过 instance.$mount( 手动将组件挂载到 DOM 上面，这样我们可以不依赖 Vue 组件树来输出DOM片段，达到自由显示通知的效果。

这中间的实现主要就是维护一个通知数组，在创建时推入，在消失时删除，这个过程并没有规定一定要如此实现，我就不赘述，以免限制大家的思路，大家可以根据自己的想法去实现。

使用该方法
要使用这个通知方法非常简单，我们可以直接import这个文件来使用，比如：

```js
import notify from './function-component.js'

notify({
  content: 'xxx',
  btn: 'xxx'
})
```

当然我们很多场景是在组件内部调用，为了方便在组件内使用，不需要每次都import，我们可以把这个方法包装成一个Vue的插件。我们创建一个index.js，内容如下：

```js
import Notification from './notification.vue'
import notify from './function'

export default (Vue) => {
  Vue.component(Notification.name, Notification)
  Vue.prototype.$notify = notify
  Vue.notify = notify
}
```

然后在项目内，我们可以通过

```js
import notify from '/path/to/notification/module'

Vue.use(notify)
```
这样之后，在组件内就可以直接通过this.$notify({...options})来调用通知了，同时还可以通过Vue.notify({...options})