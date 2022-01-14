## 
响应式数据是主动推送变化，虚拟 DOM 是被动计算数据的 Diff，一个推一个拉，它们看起来是两个方向的技术，但被 Vue 2 很好地融合在一起，采用的方式就是组件级别的划分。对于 Vue 2 来说，组件之间的变化，可以通过响应式来通知更新。组件内部的数据变化，则通过虚拟 DOM 去更新页面。这样就把响应式的监听器，控制在了组件级别，而虚拟 DOM 的量级，也控制在了组件的大小。

在模板的书写上，除了 Vue 和 React 走出的 template 和 JSX 两个路线，还出现了 Svelte 这种框架，没有虚拟 DOM 的库，直接把模板编译成原生 DOM，几乎没有 Runtime，所有的逻辑都在 Compiler 层优化，算是另外一个极致。

Vue 不需要 React 的 Fiber，因为更新系统中的 Watcher 控制在组件级。

1. Vue3把虚拟Dom控制在组件级别，组件之间使用响应式，这就让Vue3的虚拟Dom不会过于庞大
2. Vue3虚拟Dom的静态标记和自动缓存功能，让静态的节点和属性可以直接绕过Diff逻辑，也大大减少了虚拟Dom的Diff事件
3. 时间切片也会带来额外的系统复杂性

react和vue的主要区别：
1 数据更新上：react 采用fiber架构，使用链表表示DOM结构可以在diff时随时中断和继续，利用requestIdleCallback在空闲时diff，防止数据量大diff时间长导致卡顿；vue采用响应式，一个组件对应一个观察者对象，数据变更触发dom diff，将dom diff控制在组件级别；

## vue3 的新特性

* RFC 机制

* 响应式系统 

* 自定义渲染器

* 使用最近流行的 monorepo 管理方式，响应式，编译和运行时全部独立

* 平台无关渲染逻辑和浏览器渲染 API

![monorepo架构](2022-01-09-16-25-29.png)

![拆开渲染逻辑](2022-01-09-16-27-12.png)

* 全部模块使用ts重构

* Composition API 组合语法

关于composition api 的优势

* 所有 API 都是 import 引入的（现在我们的例子还没有工程化，后续会加入）。用到的功能都 import 进来，对 Tree-shaking 很友好，我的例子里没用到功能，打包的时候会被清理掉 ，减小包的大小。

* 不再上下反复横跳，我们可以把一个功能模块的 methods、data 都放在一起书写，维护更轻松。

* 代码方便复用，可以把一个功能所有的 methods、data 封装在一个独立的函数里，复用代码非常容易。

* Composotion API 新增的 return 等语句，在实际项目中使用

![关于composition](2022-01-09-16-34-16.png)

* 新的组件

Vue 3 还内置了 Fragment、Teleport 和 Suspense 三个新组件。

Fragment: Vue 3 组件不再要求有一个唯一的根节点，清除了很多无用的占位 div。

Teleport: 允许组件渲染在别的元素内，主要开发弹窗组件的时候特别有用。

Suspense: 异步组件，更方便开发有异步请求的组件。

新一代工程化工具 Vite

![总结](2022-01-09-16-38-11.png)

##

我们使用引入的 ref 函数包裹数字，返回的 count 变量就是响应式的数据，使用 add 函数实现数字的修改。需要注意的是，对于 ref 返回的响应式数据，我们需要修改 .value 才能生效，而在

✿ Options API vs Composition API

      字面上, 选项 API 与 组合 API，细品, 这反映了设计面向的改变：

      1. 选项，谁的选项，关键在“谁”。谁？组件。也是 Vue2.x 的设计基础。组件有什么，
          有状态，有改变状态的方法，有生命周期，还有组件和组件之间的关系。这种情况
          下，“数据”要接受一定的“规矩”，“什么时候能做什么事”，“什么时候有什么表现”；
          这个状态下，开发模式像是“被动接受”。

      2. 组合，什么组合，关键在“什么”。什么？数据。数据的组合。Vue3.x 设计重点变了，数
          据变绝对的C了，现在去组件里串门，不用“守规矩”了，只需要说“我在 onMounted 的时
          候要这样这样，你看着办”，真只能的以“数据”为中心，没人能管得了了，想去哪就去哪，
          自然就灵活了

      至于这些是怎么做到由“被动接受”到“主动告知”的，实现这部分内容，我很期待。

✿ 模板语法更好用

      <script setup> 像是“语法糖”，很甜；<style>里能用 v-bind，以后开发可以
      少用“黑科技”了，双手点赞。

✿ 至于思考题

      Vue 本来就属于 DSL，语法方面各有偏好，见仁见智；响应式和生命周期需要 import，个
      人认为就代表了从之前的“被动主动”转向“主动告知”，这样设计更加灵活。从此一条主线在
      ”数据"，以后查 bug 顺着这条 "线" 应该更加容易了。

本次课程的知识点可以在 Vue3 官网进行详细学习：

1. 组合式 API ： https://v3.cn.vuejs.org/api/composition-api.html#setup
2. 单文件组件 <script setup> ：https://v3.cn.vuejs.org/api/sfc-script-setup.html
3. 单文件组件样式特性：https://v3.cn.vuejs.org/api/sfc-style.html

将值封装在一个对象中，看似没有必要，但为了保持 JavaScript 中不同数据类型的行为统一，这是必须的。这是因为在 JavaScript 中，Number 或 String 等基本类型是通过值而非引用传递的：在任何值周围都有一个封装对象，这样我们就可以在整个应用中安全地传递它，而不必担心在某个地方失去它的响应性

Vue 3 的 reactive 函数可以把一个对象变成响应式数据，而 reactive 就是基于 Proxy 实现的。我们还可以通过 watchEffect，在 obj.count 修改之后，执行数据的打印。

利用对象的 get 和 set 函数来进行监听，这种响应式的实现方式，只能拦截某一个属性的修改，这也是 Vue 3 中 ref 这个 API 的实现。在下面的代码中，我们拦截了 count 的 value 属性，并且拦截了 set 操作，也能实现类似的功能。

```js
let getDouble = n => n * 2
let _value = 1
double = getDouble(_value)

let count = {
    get value() {
        return _value
    },
    set value(val) {
        _value = val
        double = getDouble(_value)

    }
}
console.log(count.value, double)
count.value = 2
console.log(count.value, double)
```

![](2022-01-09-22-23-07.png)

至于文中说的 Vue 3 的 ref 是用 “getter

         setter” 实现的，我的认识是，一个是“初始化”时的行为，一个是“改变行为”。

3. useXXX 为什么会这么灵活？
像之前的 Composition API 我理解的是 Vue 的组织单位由 “组件” 变成 “数据” 了，
现在组件在引入 useXXX，关注点在 XXX，至于 XXX 跟什么有联系，那是你的事情，在
你自己的 useXXX 里去实现。

本节提到的 React Hooks 也有异曲同工的意思，Hooks 直接翻译成什么？“钩子”，用来
做什么？“钩东西”，钩什么？那先说下这个东西出来之前有什么。

React Hooks 出来之前 React 主要构建 App 还是用 Class Component，当然也有
functional component，这俩区别就在于 class 有状态，functional 比较“纯粹”没有
状态。这样复用成问题，得用什么高阶组件之类的方式。然后，在某一时刻，同样的问
题出现了，React 复用组件的也是以带状态的 Class 组件为主，“复杂”了，不纯粹。

应用越大，这种模式开发或维护越复杂。然后 Hooks 出现了，现在 React 都用
“functional” 组件，但是有“状态”的，状态哪里来的 “Hook” 过来的，钩过来的。
组件“不负责”维护状态，useXXX 去管理了。

## 数据流

我们使用 state 定义数据，使用 mutation 定义修改数据的逻辑，并且在组件中使用 commit 去调用 mutations。在此基础之上，还可以用 getters 去实现 Vuex 世界的计算属性，使用 action 来去定义异步任务，并且在内部调用 mutation 去同步数据。

Vuex 的出现，让我们整个项目中的数据流动变得非常自然。数据流向组件，但组件不能直接修改数据，而是要通过 mutation 提出申请，mutation 去修改数据，形成了一个圆环。

## 路由

在 vue-router 中对应两个函数，分别是 createWebHashHistory 和 createWebHistory。
![](2022-01-13-22-41-46.png)

hash模式

```js
window.addEventListener('hashchange', fn)
```

history模式

因为 HTML5 标准发布，浏览器多了两个 API：pushState 和 replaceState。

```js


window.addEventListener('popstate', fn)
```

## 调试

## jsx

## TypeScript 

## Vue

## 
