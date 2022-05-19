# vue 源码分析之 watch

Vue 中存在三中watcher， 第一种是定义在data函数时定义数据的render watcher，第二种是computed watcher，是computed函数在自身内部维护的一个watcher，配合其内部的属性dirty开关来决定computed的值是需要重新计算还是直接复用之前的值，第三种就是watcher api了，就是用户自定义的export导出对象的watch属性

Vue.js的数据响应式，通常有以下的的场景：

1. 数据变->使用数据的视图变。
2. 数据变->使用数据的计算属性变->使用计算属性的视图变。
3. 数据变->开发者主动注册的watch回调函数执行。

三个场景，对应三种watcher：

1. 负责视图更新的render watcher。
2. 执行计算属性更新的computed watcher。
3. 用户注册的普通watcher api。

## render watcher

在render watcher中，响应式就意味着，当数据中的值改变时，在视图上的渲染内容也需要跟着改变，在这里就需要一个视图渲染与属性值之间的联系，Vue中的响应式，简单点来说分为以下三个部分：

1. Observer: 这里的主要工作是递归地监听对象上的所有属性，在属性值改变的时候，触发相应的Watcher。
2. Watcher: 观察者，当监听的数据值修改时，执行响应的回调函数，在Vue里面的更新模板内容。
3. Dep: 链接Observer和Watcher的桥梁，每一个Observer对应一个Dep，它内部维护一个数组，保存与该Observer相关的Watcher。

首先实现Dep方法，这是链接Observer和Watcher的桥梁，简单来说，就是一个监听者模式的事件总线，负责接收watcher并保存。其中subscribers数组用以保存将要触发的事件，addSub方法用以添加事件，notify方法用以触发事件。

```javascript
function __dep(){
    this.subscribers = [];
    this.addSub = function(watcher){
        if(__dep.target && !this.subscribers.includes(__dep.target) ) this.subscribers.push(watcher);
    }
    this.notifyAll = function(){
        this.subscribers.forEach( watcher => watcher.update());
    }
}
```

Observer方法就是将数据进行劫持，使用Object.defineProperty对属性进行重定义，注意一个属性描述符只能是数据描述符和存取描述符这两者其中之一，不能同时是两者，所以在这个小Demo中使用getter与setter操作的的是定义的value局部变量，主要是利用了let的块级作用域定义value局部变量并利用闭包的原理实现了getter与setter操作value，对于每个数据绑定时都有一个自己的dep实例，利用这个总线来保存关于这个属性的Watcher，并在set更新数据的时候触发。

```javascript
function __observe(obj){
    for(let item in obj){
        let dep = new __dep();
        let value = obj[item];
        if (Object.prototype.toString.call(value) === "[object Object]") __observe(value);
        Object.defineProperty(obj, item, {
            configurable: true,
            enumerable: true,
            get: function reactiveGetter() {
                if(__dep.target) dep.addSub(__dep.target);
                return value;
            },
            set: function reactiveSetter(newVal) {
                if (value === newVal) return value;
                value = newVal;
                dep.notifyAll();
            }
        });
    }
    return obj;
}
```

Watcher 方法传入一个回调函数，用以执行数据变更后的操作，一般是用来进行模板的渲染，update 方法就是在数据变更后执行的方法，activeRun 是首次进行绑定时执行的操作，关于这个操作中的 __dep.target，他的主要目的是将执行回调函数相关的数据进行 sub，例如在回调函数中用到了 msg，那么在执行这个 activeRun 的时候__dep.target 就会指向 this，然后执行 fn()的时候会取得 msg，此时就会触发 msg的 get()，而 get 中会判断这个 __dep.target是不是空，此时这个__dep.target 不为空，上文提到了每个属性都会有一个自己的 dep 实例，此时这个__dep.target 便加入自身实例的 subscribers，在执行完之后，便将__dep.target设置为null，重复这个过程将所有的相关属性与watcher进行了绑定，在相关属性进行 set 时，就会触发各个 watcher 的 update 然后执行渲染等操作。

```javascript
function __watcher(fn){
    this.update = function(){
        fn();
    }
    
    this.activeRun = function(){
        __dep.target = this;
        fn();
        __dep.target = null;
    }
    this.activeRun();
}
```

## computed watcher

computed 函数在自身内部维护的一个 watcher，配合其内部的属性 dirty 开关来决定 computed 的值是需要重新计算还是直接复用之前的值。

computed 计算属性非常适用于一个数据受多个数据影响以及需要对数据进行预处理的条件下使用。

computed 计算属性可以定义两种方式的参数，{ [key: string]: Function | { get: Function, set: Function } }，计算属性直接定义在 Vue 实例中，所有 getter 和setter 的 this 上下文自动地绑定为 Vue 实例，此外如果为一个计算属性使用了箭头函数，则 this 不会指向这个组件的实例，不过仍然可以将其实例作为函数的第一个参数来访问，计算属性的结果会被缓存，除非依赖的响应式 property 变化才会重新计算，注意如果某个依赖例如非响应式 property 在该实例范畴之外，则计算属性是不会被更新的。

## watcher api

在 watch api 中可以定义 deep 与 immediate 属性，分别为深度监听 watch 和 最初绑定即执行回调的定义，在 render watch 中定义数组的每一项由于性能与效果的折中并不会直接被监听，但是使用 deep 就可以对其进行监听。

对于watch api，类型{ [key: string]: string | Function | Object | Array }，是一个对象，键是需要观察的表达式，值是对应回调函数，值也可以是方法名，或者包含选项的对象，Vue实例将会在实例化时调用$watch()，遍历watch对象的每一个property。

不应该使用箭头函数来定义watcher函数，例如searchQuery: newValue => this.updateAutocomplete(newValue)，理由是箭头函数绑定了父级作用域的上下文，所以this将不会按照期望指向Vue实例，this.updateAutocomplete将是undefined。

## computed 和 watch 的区别

computed是计算属性，用来计算一个属性的值。

调用的时候不需要加括号，可以直接当属性来用
根据依赖自动缓存，依赖不变的时候，值不会重新计算

watch
watch的意思是监听，当发生变化时，监听并且执行。

immediate: true 表示在侦听器创建时立即触发回调。第一次调用时旧值是 undefined。
deep表示对对象里面的变化进行深度监听
不支持缓存，数据变，直接会触发相应的操作

当依赖的值变化时，在watch中，是可以做一些复杂的操作的，而computed中的依赖，仅仅是一个值依赖于另一个值，是值上的依赖。

如果一个值依赖多个属性（多对一），用computed肯定是更加方便的。如果一个值变化后会引起一系列操作，或者一个值变化会引起一系列值的变化（一对多），用watch更加方便一些。
watch 支持异步代码而 computed 不支持。
