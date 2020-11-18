# fiber

react 的 jsx 语法会被编译成 react.createElement:

React 用$$typeof标识了一个 React element, 而每个这样的element对应了一个fiber。

## 什么是 fiber

* 一个fiber就是一个对象结构，包含了一系列要完成的任务。
* react 的每一个element都对应了一个fiber（一棵elements树就对应了一棵fiber节点树）。
* 一个fiber不会在每次render中重新创建，相反，它是一个可以被操作改变的数据结构，保留了组件的状态和dom。所以操作在每个fiber上任务（更新，删除等）都可以映射到对应的element。

## 为什么要用 fiber

* 暂停任务，并且可以稍后继续
* 为不同的任务标记优先级
* 重用之前完成的任务
* 终止不再需要的任务

react 有了优先级调度(schedule)的能力, 也让 react 能把 reconciliation (计算哪一部分的 element 树需要被更新, 计算更新的这一步也被分为很多 unit, 防止阻塞主线程 ) 和 render( 使用那些计算好的更新信息, 把更新渲染到用户屏幕上) 分开, 使得 reconciliation 可以重用在不同平台上( react native,react dom)

几个重要的属性

```js
{
    type: React.createElement 对应的type，表明这个fiber 节点对应的element
    tag: 表明fiber 的类型
    pendingProps: 已经是被更新的props，需要被运用到子组件或者dom 元素上
    key: 对应prop 上的key
    stateNode:  dom节点(HostComponent) / 类组件的实例 (ClassComponent) / fn() (FunctionComponent) 
    nextEffect:  指向下一个**effect list**中的节点 （effect list：一个workInProgress（finishedWork）的子树，是在render阶段 最终需要决定被执行更新 的产物，会在commit阶段被处理）
    effectTag:  当前fiber需要执行的副作用类型
    alternate:  用于构成**workInProgress**（从当前fiber树构建而来，反应了需要被更新渲染到用户屏幕的状态树）
    return: 指向父fiber节点
    sibling: 指向兄弟fiber节点
    child： 指向child fiber节点
  }
```

# fiber 与 fiber tree
react 运行时存在3中实例:

```js
DOM 真实DOM节点
-------
Instances React维护的vDOM tree node
-------
Elements 描述UI长什么样子（type, props）
```

Instances是根据Elements创建的，对组件及DOM节点的抽象表示，vDOM tree维护了组件状态以及组件与DOM树的关系

在首次渲染过程中构建出vDOM tree，后续需要更新时（setState()），diff vDOM tree得到DOM change，并把DOM change应用（patch）到DOM树


fiber之前的reconciler（被称为Stack reconciler）自顶向下的递归mount/update，无法中断（持续占用主线程），这样主线程上的布局、动画等周期性任务以及交互响应就无法立即得到处理，影响体验

Fiber解决这个问题的思路是把渲染/更新过程（递归diff）拆分成一系列小任务，每次检查树上的一小部分，做完看是否还有时间继续下一个任务，有的话继续，没有的话把自己挂起，主线程不忙的时候再继续

增量更新需要更多的上下文信息，之前的vDOM tree显然难以满足，所以扩展出了fiber tree（即Fiber上下文的vDOM tree），更新过程就是根据输入数据以及现有的fiber tree构造出新的fiber tree（workInProgress tree）。因此，Instance层新增了这些实例：





