# Vuex 初始化

安装

``` JS
export default {
    Store,
    install,
    version: '__VERSION__',
    mapState,
    mapMutations,
    mapGetters,
    mapActions,
    createNamespacedHelpers
}
```

``` JS
export function install(_Vue) {
    if (Vue && _Vue === Vue) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(
                '[vuex] already installed. Vue.use(Vuex) should be called only once.'
            )
        }
        return
    }
    Vue = _Vue
    applyMixin(Vue)
}
```

applyMixin 就是这个 export default function，它还兼容了 Vue 1.0 的版本，这里我们只关注 Vue 2.0 以上版本的逻辑，它其实就全局混入了一个 beforeCreate 钩子函数，它的实现非常简单，就是把 options.store 保存在所有组件的 this.$store 中，这个 options.store 就是我们在实例化 Store 对象的实例，稍后我们会介绍，这也是为什么我们在组件中可以通过 this.$store 访问到这个实例。

# Store 实例化

``` JS
export class Store {
    constructor(options = {}) {
        // Auto install if it is not done yet and `window` has `Vue`.
        // To allow users to avoid auto-installation in some cases,
        // this code should be placed here. See #731
        if (!Vue && typeof window !== 'undefined' && window.Vue) {
            install(window.Vue)
        }

        if (process.env.NODE_ENV !== 'production') {
            assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
            assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
            assert(this instanceof Store, `Store must be called with the new operator.`)
        }

        const {
            plugins = [],
                strict = false
        } = options

        // store internal state
        this._committing = false
        this._actions = Object.create(null)
        this._actionSubscribers = []
        this._mutations = Object.create(null)
        this._wrappedGetters = Object.create(null)
        this._modules = new ModuleCollection(options)
        this._modulesNamespaceMap = Object.create(null)
        this._subscribers = []
        this._watcherVM = new Vue()

        // bind commit and dispatch to self
        const store = this
        const {
            dispatch,
            commit
        } = this
        this.dispatch = function boundDispatch(type, payload) {
            return dispatch.call(store, type, payload)
        }
        this.commit = function boundCommit(type, payload, options) {
            return commit.call(store, type, payload, options)
        }

        // strict mode
        this.strict = strict

        const state = this._modules.root.state

        // init root module.
        // this also recursively registers all sub-modules
        // and collects all module getters inside this._wrappedGetters
        installModule(this, state, [], this._modules.root)

        // initialize the store vm, which is responsible for the reactivity
        // (also registers _wrappedGetters as computed properties)
        resetStoreVM(this, state)

        // apply plugins
        plugins.forEach(plugin => plugin(this))

        if (Vue.config.devtools) {
            devtoolPlugin(this)
        }
    }
}
```

我们把 Store 的实例化过程拆成 3 个部分，分别是初始化模块，安装模块和初始化 store._vm，接下来我们来分析这 3 部分的实现。

``` JS
function makeLocalContext(store, namespace, path) {
    const noNamespace = namespace === ''；

    const local = {
        dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
            let {
                type
            } = args;
            if (!options || !options.root) {
                type = namespace + type
            }
        }
    }
    return store.dispatch(type, payload)
}
```

``` JS
function makeLocalGetters(store， namespace) {
    const gettersProxy = {};

    const splitPos = namespace.length;

    const localType = type.slice(splicePos)

    Object.defineProperty(gettersProxy, localType, {
        get: () => store.getters[type],
        enumerable: true
    })

    return gettersProxy
}
```

Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter，甚至是嵌套子模块——从上至下进行同样方式的分割：

``` js
function registerAction(store, type, handler, local) {
    const entry = store._actions[type] || (store._actions[type] = []);
    entry.push(function wrappedActionHandler(payload, cb) {
        let res = handler.call(store, {
            dispatch: local.dispatch,
            commit: local.commit,
            getters: local.getters,
            state: local.state,
            rootGetters: store.getters,
            rootState: store.state
        }, payload, cb)
    })
}
```

如果我们去访问state，

```js
get state(){
  return this._vm_data.$$data
}
```






