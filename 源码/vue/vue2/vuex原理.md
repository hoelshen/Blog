
# 安装

vue.use 的方法来安装插件， 内部会调用插件提供的 install 方法

```js
let Vue;

export default install (_Vue) {
    Vue.mixin({ beforeCreate: vuexInit });
    Vue = _Vue;
}
```

我们采用 Vue.mixin 方法将 vuexInit 方法混淆进 beforeCreate 钩子中，并用 Vue 保存 Vue 对象。那么 vuexInit 究竟实现了什么呢

我们在初始化的时候。 将 store 绑定好

```js
function vuexInit () {
    const options = this.$options;
    if (options.store) {
        this.$store = options.store;
    } else {
        this.$store = options.parent.$store;
    }
}
```

store

数据的响应式化

```js
constructor () {
    this._vm = new Vue({
        data: {
            ?state: this.state
        }
    })
}
```

state 会将需要的依赖收集在dep 中，在被修改时更新对应试图

```js
let globalData = {
    d: 'hello world'
};
new Vue({
    data () {
        return {
            ?state: {
                globalData
            }
        }
    }
});

/* modify */
setTimeout(() => {
    globalData.d = 'hi~';
}, 1000);

Vue.prototype.globalData = globalData;
```

上述代码在全局有一个 globalData，它被传入一个 Vue 对象的 data 中，之后在任意 Vue 模板中对该变量进行展示，因为此时 globalData 已经在 Vue 的 prototype 上了所以直接通过 this.prototype 访问，也就是在模板中的 {{globalData.d}}。此时，setTimeout 在 1s 之后将 globalData.d 进行修改，我们发现模板中的 globalData.d 发生了变化。其实上述部分就是 Vuex 依赖 Vue 核心实现数据的“响应式化”。

commit

首先是 commit 方法，我们知道 commit 方法是用来触发 mutation 的。

```js
commit (type, payload, _options) {
    const entry = this._mutations[type];
    entry.forEach(function commitIterator (handler) {
        handler(payload);
    });
}
```

从 _mutations 中取出对应的 mutation，循环执行其中的每一个 mutation。

dispatch

dispatch 同样道理，用于触发 action，可以包含异步状态。

```js
dispatch (type, payload) {
    const entry = this._actions[type];

    return entry.length > 1
    ? Promise.all(entry.map(handler => handler(payload)))
    : entry[0](payload);
}

```

同样的，取出 _actions 中的所有对应 action，将其执行，如果有多个则用 Promise.all 进行包装。
