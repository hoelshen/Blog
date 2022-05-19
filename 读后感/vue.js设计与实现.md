# vue的设计与实现

## 1. 权衡的艺术

### 声明式和命令式

* 命令式框架的一大特点就是关注过程---jquery
* 声明式框架更关注结果--vue  vue内部实现一定是命令式的, 而暴露给用户的缺更加声明式

总结: 声明式代码的性能不优于命令式代码代码的性能

原因如下:

    直接修改的性能消耗定义为A  找出差异的消耗定义为B

则

    命令式代码的更新性能消耗≈A
    声明式代码的更新性能消耗≈B+A

* 比较innerHTML和虚拟DOM的性能

对于innerHTML来说, 为了创建页面, 我们需要先把字符串解析成dom树, 这是一个DOM层面的计算, 涉及到DOM的运算要远比Javascript层面的计算性能差.

    innerHTML创建页面的性能: HTML字符串拼接的计算量 + innerHTML的DOM计算量

虚拟DOM创建页面的过程分为两步:
第一步是创建JavaScript对象, 这个对象可以理解为真实DOM层面的描述;
第二步是递归地遍历虚拟DOM树并创建真实DOM

    虚拟DOM创建页面的性能: 创建JavaScript对象的计算量 + 创建真实DOM的计算量

innerHTML和document.createElement等DOM操作方法有何差异

当设计框架时候我们有三种选择: 纯运行时 运行时+ 编译时或纯编译时

* 纯运行时: render函数 处理数据对象 渲染到页面

* 编译时: 编译得到树形结构的数据对象

compiler的程序, 它的作用就是把HTML字符串编译成树形结构的数据对象

* 运行时 + 编译时 相结合 就是把这两个组合起来  即支持编译时, 用户可以提供HTML字符串, 我们将其编译成数据对象再交给运行时处理

准确来说 其实是运行时编译, 意思是代码运行的时候才开始编译, 而这会产生一定的开销, 因此我们也可以在构建的时候就执行Compiler程序将用户提供的内容编译好, 等到运行时就无需编译了, 这对性能是非常友好的.

* 纯编译时 直接将HTML字符串编译成命令式代码

```html
< div>
    < span> hello world < /span>
< /div>
```

编译

```js
const div = document.createElement('div');
const span = document.createElement('span');
span.innerText = 'hello world';
div.appendChild(span);
document.body.appendChild(div)
```

纯运行时: 由于没有编译过程, 我们没办法分析用户提供内容, 但如果加入编译步骤, 我们可以分析用户提供的内容, 进行优化, 并在render函数得到这些信息之后, 进行优化.
纯编译时: 也能做到内容的分析, 并优化.

Tree-Shaking 是一种排除DEAD CODE 的机制 工具/*#__PURE__*/ 注释
Tree-Shaking 依赖于ESM的静态结构以及是否产生副作用, 如果一个函数的副作用 调用函数的时候会对外部产生影响

rollup 配置里面format有三种形式: 'iife', 'esm', 'cjs'

1. 在浏览器环境中,除了能够用scripts标签引用iife格式的资源外,还可以直接引用ESM格式的资源

2. 在node.js环境中 资源的模块格式应该是commonJs

如果在package.json 中存在module 字段,那么会优先使用module 字段指向的资源来替代main字段指向的资源

* vue.runtime.esm-bundler.js
* vue.runtime.esm-browser.js

带有 -bundler 字样的 ESM 资源是在rollup.js 或webpack等打包工具使用,而带有 -browser 字样的ESM资源是直接给  
<\script type='module'\>
使用的
它们的区别在与__DEV__常量替换为字面量true或者false, 后者将_DEV_常量替换为process.env.NODE_ENV !== 'production' 语句

__使用模板和 JavaScript 对象描述UI有何不同: 使用 JavaScript 对象描述UI更加灵活.__

__而使用 JavaScript 对象描述UI的方式, 其实就是所谓的虚拟DOM__

所以vue.js 除了支持使用模板描述UI外,还支持使用虚拟DOM描述UI.

```vue
import { h} form 'vue'
export default {
    render() {
        return h('h1', { onClick: handler }) //  虚拟DOM  
    }
}

```

这里用到的h函数调用,返回值,就是一个对象, 其作用就是让我们编写虚拟DOM更加轻松

虚拟DOM: 用 JavaScript 对象来描述真实的DOM结构

渲染器的作用就是把虚拟DOM渲染为真实DOM

渲染器render的实现思路:

1.创建元素
2.为元素添加属性和事件
3. 处理children

组件就是一组DOM元素的封装,它可以返回虚拟DOM的函数,也可以是一个对象,但这个对象下必须要有一个函数用来产生组件要渲染的虚拟DOM.

render 函数 要处理 组件

```js
function mountElement(vnode, container){
    const el = document.element(vnode.tag);

    for(const key in vnode.props){
        if(/^on/.test(key)){
            el.addEventListener(
               key.substr(2).toLowerCase(),  // 事件名称 onClick  ---->click
                vnode.props[key]  // 事件处理函数
            )    
        
        };
    }
}
```

编译器的作用就是将模板编译为渲染函数.

对于编译器来说,模板就是一个普通的字符串.

编译器会把模板内容编译成渲染函数并添加到<\script>标签块的组件对象上.

对于一个组件来说,它要渲染的内容最终都是通过渲染函数产生的,然后渲染器再把渲染函数返回的虚拟DOM渲染为真实DOM

渲染器在渲染组件时,会先获取组件要渲染的内容,即执行组件的渲染函数并得到返回值,我们称之为subtree,最后在递归地调用渲染器将subtree渲染出来即可.

## 响应系统

响应函数和副作用

指的是会产生副作用的函数

```js
// 用一个全局变量存储被注册的副作用函数
let activeEffect

function effect(fn){
    activeEffect = fn
    // 执行副作用
    fn();
};

```

### 解决无限循环

```JS
 function trigger(target, key) {
    const depsMap = bucket.get(target);
    if(!depsMap) return 
    const effects = depsMap.get(key);
    
    const effectsToRun = new set()
    effects && effects.forEach(effectFn => {
    // 如果trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发函数
        if(effectFn !== activeEffect){
            effectsToRun.add(effectFn)
        }
    });
    effectsToRun.forEach(effectFn => effectFn()) 
 }
```

### 调度执行

 可调度性是响应式系统非常重要的特性，首先我们需要明确什么是可调度性。所谓可调度性，指的是当trigger动作触发副作用函数重新执行时，有能力决定副作用函数执行时的时机、次数以及方式

```JS
//JavaScript
    effect(
        () = {
            console.log(obj.foo)
        },
        // options
        {
            // 调度器 scheduler 是一个函数
            scheduler(fn){
                // 
            }
        }
    )
```

```javascript
function effect(fn, options){
    const effectFn = ()=> {
        cleanup(effectFn);
        // 当调用effect注册副作用函数时，将副作用函数复制给activeEffect
        activeEffect = effectFn
        // 在调用副作用函数之前将当前副作用函数压栈
        effectStack.push(effectFn)
        fn();
        // 在调用副作用函数执行完毕，将当前副作用函数弹出，并把activeEffect还原为之前的值
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    // 将options 挂载到effectFn 上
    effectFn.options = options //
    // activeEffect.deps 用来存储所有与该副作用相关的依赖集合
    effectFn.deps = []; 
    // 执行副作用函数
    effectFn()
};    
```

effect函数来注册副作用函数，
用来追踪和收集依赖的track函数
用来触发副作用函数重新执行的trigger函数

```JS
 function trigger(target, key) {
    const depsMap = bucket.get(target);
    if(!depsMap) return 
    const effects = depsMap.get(key);

    const effectsToRun = new set()
    effects && effects.forEach(effectFn => {
    // 如果trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发函数
        if(effectFn !== activeEffect){
            effectsToRun.add(effectFn)
        }
    });
    effectsToRun.forEach(effectFn => {
        // 如果一个副作用函数存在调度器，则调用调度器，并将副作用函数作为参数传递
        if(effectFn.options.scheduler){
            effectFn.options.scheduler(effectFn) // 新增
        } else {
            // 否则直接执行副作用
            effectFn()  // 新增
        }
    })
 }
```

### 计算属性computed与lazy

懒执行

```JS
//JavaScript
function effect(fn, options = {}){
    const effectFn = () => {
        cleanup(effectFn);
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.options = options
    effectFn.deps = [];
    if(!options.lazy) {  //只有非lazy的时候，才执行
        effectFn();
    } 

    return effectFn //  新增
}
```

如果我们能够实现自定义调度

```JS
//JavaScript
function effect(fn, options = {}){
    const effectFn = () => {
        cleanup(effectFn);
        activeEffect = effectFn
        effectStack.push(effectFn)
        // 将 fn 的执行结果存储到 res 中 
        const res = fn();
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        // 将res 做为effectFn的返回值
        return res
    }
    effectFn.options = options
    effectFn.deps = [];
    if(!options.lazy) {  //只有非lazy的时候，才执行
        effectFn();
    } 

    return effectFn //  新增
}
```

```js
//  调度器
function computed(){
    let value
    let dirty = true
    const effectFn = effect(getter, {
        lazy: true,
        // 添加调度器，在调度器中将dirty重置为 true
        scheduler() {
            dirty = true
        }
    })
    const obj = {
        get value(){
            // 只有“脏”时才计算值，并将得到的值缓存到value中
            if(dirty){
                value = effectFn();
                // 将dirty设置为false，下一次访问直接使用缓存到value中的值
                dirty = false
            }
            return value
        }
    }
    return obj
}
```

// 解决属性变化之后， effectFn 没有发生改变

```JS
//  调度器
function computed(){
    let value
    let dirty = true
    const effectFn = effect(getter, {
        lazy: true,
        // 添加调度器，在调度器中将dirty重置为 true
        scheduler() {
            if(!dirty){
                 dirty = true
                // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响应
                trigger(obj, 'value') 
            }
        }
    })
    const obj = {
        get value(){
            // 只有“脏”时才计算值，并将得到的值缓存到value中
            if(dirty){
                value = effectFn();
                // 将dirty设置为false，下一次访问直接使用缓存到value中的值
                dirty = false
            }
            // 当读取 value 中，手动调用track函数进行追踪
            track(obj, 'value')
            return value
        }
    }
    return obj
}
```

## watch的实现原理

本质上就是观测一个响应式数据，当数据发生变化时，通知并执行相应的回调函数

watch本质上就是利用了effect以及options.scheduler选项

```JS
//JavaScript
effect(() => {
    console.log(obj.foo)
},{
    scheduler(){
        //当obj.foo的值发生变化时，会执行scheduler调度函数
    }
})

```

如果副作用函数存在scheduler选项，当响应式数据发生变化时，会触发scheduler调度函数执行，而非直接触发副作用函数执行。从这个角度来看，其实scheduler调度函数就相当于一个回调函数
调度执行

## 非原始值的响应式方案

### proxy只能代理对象，无法代理非对象值，例如字符串、布尔值

```JS
const p  = new Proxy(obj, {
    // 拦截读取属性操作
    get(){

    }
    // 拦截设置属性操作
    set(){
        
    }
})
```

第一个参数是被代理的对象，第二个参数也是一个对象，这个对象是一组夹子（trap）

```JS
const fn = (name) => {
    console.log('我是：', name)
}
// 调用函数是对对象的基本操作
fn()
```

```JS
const p2 = new Proxy(fn, {
    // 使用 apply 拦截函数调用
    apply(target, thisArg, argArray){
        target.call(thisArg, ...argArray)
    }
})
```

## 原始值的响应式方案

proxy 只能代理对象，无法代理非对象的值，例如字符串、布尔值。
所谓的代理，指的是对一个对象基本语义的代理，它允许我们拦截并重新定义一个对象的基本操作。

```JS
obj.foo // 读取属性foo的值
obj.foo++ //读取和设置属性foo的值
```

类似这种读取、设置属性值的操作，就属于基本语义的操作。
在js世界里，万物皆是对象。例如一个函数也是一个对象，所以调用函数也是对一个对象的基本操作。

```javascript
const fn = (name) => {
    console.log('我是', name)
}
// 调用函数是对对象的基本操作
fn()
const p2 = new Proxy(fn, {
    // 使用apply 拦截函数调用
    apply(target, thisArg, argArray){
        target.call(thisArg, ...argArray)
    }
})
p2('sjh') // 
```

proxy只能够拦截对一个对象的基本操作，调用对象下的方法就是典型的非基本操作，我们叫它复合操作：__obj.fn__
实际上调用一个对象下的方法，是由两个基本语义组成， 第一个基本语义是get，既先通过get操作得到obj.fn属性，第二个基本语义是函数调用，即通过get得到obj.fn的值后再调用它，也就是我们上面说到的apply。

Reflect

Reflect.get函数还能够接收第三个参数，即指定接收者receiver，可以理解为调用过程中的this

```javascript
    const obj = {foo :1}
    console.log(Reflect.get(obj, foo, {foo: 2}))
```

原始状态：

```javascript
### proxy只能代理对象，无法代理非对象值，例如字符串、布尔值

const p  = new Proxy(obj, {
    // 拦截读取操作, 接收第三个参数receiver
    get(target, key, receiver){
        track(target, key)
        // 使用Reflect.get返回读取到的属性值
        return Reflect.get(target, key, receiver)
    }
})
```

this由原始对象obj变成了代理对象p。 这会在副作用函数雨响应式数据之间监理响应式联系

#### JavaScript对象及Proxy的工作原理

    根据ECMAScript规范，在JavaScript中有两种对象，其中一种叫做常规对象， 另一种叫做异质对象

在javascript 中，对象的实际语义是由对象的内部方法（internal method）指定的， 所谓内部方法，指的是当我们对一个对象进行操作时在引擎内部调用的方法， 这些方法对于JavaScript使用者来说是不可见的。

在ECMAScript 规范中使用【【xxx】】来代表内部方法或内部槽

如果一个对象需要作为函数调用，那么这个对象就必须部署内部方法【【Call】】。
如何区分一个对象是普通对象还是函数呢？
通过内部方法和内部槽来区分对象，例如函数对象会部署内部方法【【Call】】，而普通对象不会

__函数的多态--- 普通对象和proxy对象都部署了【【call】】这个内部方法，但它们的逻辑不同。__

如果在创建代理对象时没有指定对应的拦截函数，例如没有指定get（）拦截函数，那么当我们通过代理对象访问属性值时，代理对象的内部方法【【Get】】会调用原始对象的内部方法【【Get】】来获取属性值，这其实就是代理透明性质。

创建代理对象时指定的拦截函数，实际上是用来自定义代理对象本身的方法和行为的，而不是用来指定被代理对象的内部方法和行为的

// 删除

// 新增

```javascript
function reactive(obj){
    return new Proxy(obj, {
        set(target, key, newVal, receiver){
            const oldValue = target[value];
            const type  = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD';
            const res = Reflect.set(target, key, newVal, receiver);

            // target === receiver.raw 说明receiver 就是target的代理对象
            if (target === receiver.raw) {
                if(oldValue !== newVal && (oldValue === oldValue) || (newVal === newVal)){
                        trigger(target, key, value)
                }
            }
            return res  
        }
    })
}
```

#### 深响应和浅响应

```javascript
function createReactive(obj, isShallow == false){
    return new Proxy(obj, {
        get(target, key, receiver){
            if(key === 'raw'){
                return target
            } 

            const res = Reflect.get(target, key, receiver)
               track(target, key)

            // 如果是浅响应，则直接返回原始值
            if(isShallow) {
                return res
            }
            
            if(typeof res === 'obj'  && res !== null){
                return reactive(res)
            }

            return res
        }
    })
}
```

```javascript
function reactive(obj){
    return createReactive(obj)
}

function shallowReactive(obj){
    return createReactive(obj, true)
}
```

## 简单的 diff 算法

渲染器更改完之后 会去改变真实的DOM，然后再去移动节点 完成真实的DOM更新
调度执行

移动元素

移动节点指的是， 移动一个虚拟节点所对应的真实dom节点，并不是移动虚拟节点本身。

```JS
function patchElement(n1, n2){
    // 新的 vnode 也引用了真实dom 元素
    const el = n2.el = n1.el;
}
```

添加元素

1. 想办法找到新增节点
2. 将新增节点挂载到正确位置

总结：
简单diff算法的核心逻辑是，拿新的一组子节点去旧的一组子节点中寻找可复用的节点。如果这道则记录该节点的位置索引。我们把这个位置索引称为最大索引。在整个更新过程中，如果一个节点的索引小雨最大索引，则说明该节点对应的真实dom元素需要移动。

## 双端diff算法

    同时对新旧两组子节点的两个端点进行比较的算法，因此我们需要四个索引，分别指向新旧两组子节点的端点

## 快速diff算法

    这在vue3中运用到了
