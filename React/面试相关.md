
## react 组件通信如何实现

父组件向子组件通讯: 父组件可以向子组件通过传 props 的方式，向子组件进行通讯
子组件向父组件通讯: props+回调的方式,父组件向子组件传递props进行通讯，此props为作用域为父组件自身的函数，子

跨层级通信: Context设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言,对于跨越多层的
全局数据通过Context通信再适合不过

发布订阅模式: 发布者发布事件，订阅者监听事件并做出反应,我们可以通过引入event模块进行通信

全局状态管理工具: 借助Redux或者Mobx等全局状态管理工具进行通信,这种工具会维护一个全局状态中心Store,并根据不同的事件产生新的状态


## 你是如何理解fiber的?

React Fiber 是一种基于浏览器的单线程调度算法.
React 16之前 ，reconcilation 算法实际上是递归，想要中断递归是很困难的，React 16 开始使用了循环来代替之前的递归.
Fiber：一种将 recocilation （递归 diff），拆分成无数个小任务的算法；它随时能够停止，恢复。停止恢复的时机取决于当前的一帧（16ms）内，还有没有足够的时间允许计算。


## react-redux是如何工作的

Provider: Provider的作用是从最外部封装了整个应用，并向connect模块传递store
connect: 负责连接React和Redux

获取state: connect通过context获取Provider中的store，通过store.getState()获取整个store tree 上所有state
包装原组件: 将state和action通过props的方式传入到原组件内部wrapWithConnect返回一个ReactComponent对象Connect，Connect重新render外部传入的原组件WrappedComponent，并把connect中传入的mapStateToProps, mapDispatchToProps与组件上原有的props合并后，通过属性的方式传给WrappedComponent
监听store tree变化: connect缓存了store tree中state的状态,通过当前state状态和变更前state状态进行比较,从而确定是否调用this.setState()方法触发Connect及其子组件的重新渲染

## redux与mobx的区别

两者对比:

redux将数据保存在单一的 store 中，mobx将数据保存在分散的多个 store 中
redux使用plain object保存数据，需要手动处理变化后的操作；mobx 适用observable保存数据，数据变化后自动处理响应的操作
redux使用不可变状态，这意味着状态是只读的，不能直接去修改它，而是应该返回一个新的状态，同时使用纯函数；mobx 中的状态是可变的，可以直接对其进行修改
mobx相对来说比较简单，在其中有很多的抽象，mobx更多的使用面向对象的编程思维；redux会比较复杂，因为其中的函数式编程思想掌握起来不是那么容易，同时需要借助一系列的中间件来处理异步和副作用
mobx中有更多的抽象和封装，调试会比较困难，同时结果也难以预测；而redux提供能够进行时间回溯的开发工具，同时其纯函数以及更少的抽象，让调试变得更加的容易

场景辨析:

mobx更适合数据不复杂的应用: mobx难以调试,很多状态无法回溯,面对复杂度高的应用时,往往力不从心.

redux适合有回溯需求的应用: 比如一个画板应用、一个表格应用，很多时候需要撤销、重做等操作，由于redux不可变的特性，天然支持这些操作.

mobx适合短平快的项目: mobx上手简单,样板代码少,可以很大程度上提高开发效率.


## redux 中如何进行异步操作?

可以在componentDidmount中直接进行请求无须借助redux.

或者使用异步流的管理, 通常我们会借助 redux 的异步中间件进行异步处理


## 为什么取消了 UNSAFE 前缀

# unSafe

React官网上的计划是：


16.3：为不安全生命周期引入别名UNSAFE_componentWillMount，UNSAFE_componentWillReceiveProps和UNSAFE_componentWillUpdate。 （旧的生命周期名称和新的别名都可以在此版本中使用。）


未来的16.x版本：为componentWillMount，componentWillReceiveProps和componentWillUpdate启用弃用警告。 （旧的生命周期名称和新的别名都可以在此版本中使用，但旧名称会记录DEV模式警告。）


17.0：删除componentWillMount，componentWillReceiveProps和componentWillUpdate。 （从现在开始，只有新的“UNSAFE_”生命周期名称将起作用。)


React意识到componentWillMount、componentWillReceiveProps和componentWillUpdate这三个生命周期函数有缺陷，比较容易导致崩溃。但是由于旧的项目已经在用以及有些老开发者习惯用这些生命周期函数，于是通过给它加UNSAFE_来提醒用它的人要注意它们的缺陷。
2、React加入了两个新的生命周期函数getSnapshotBeforeUpdate和getDerivedStateFromProps，目的为了即使不使用这三个生命周期函数，也能实现只有这三个生命周期能实现的功能。


```js

componentWillMount、
componentWillReceiveProps
componentWillUpdate

```

现在这几个生命周期函数前都增加了“UNSAFE_”前缀，变成如下模样：

```js

UNSAFE_componentWillMount、
UNSAFE_componentWillReceiveProps
UNSAFE_componentWillUpdate

```

因为Fiber重构后，渲染变成了异步的，通过查看新的生命周期图谱，这几个方法都处于原来的render阶段，也就是会出现重复调用的问题，比如说不合理的使用setState造成重复渲染死循环等。

总结
总的来说，React生命周期的进化都是为Fiber架构服务的，Fiber带了异步渲染的机制，使生命周期变的更加纯粹和可控，同时也减少了我们书写代码不规范造成的不必要的bug。

## setState到底是异步还是同步

案: 有时表现出异步,有时表现出同步

1. setState只在合成事件和钩子函数中是“异步”的，在原生事件和setTimeout 中都是同步的。

2. setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。

3. setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次setState，setState的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时setState多个不同的值，在更新时会对其进行合并批量更新。

## ref 使用

ref 不能挂载在 function component 上,因为他没有实例, 只有 class component 才有
