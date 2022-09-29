# React 面试准备

## 知识点梳理：
### React基础模块：
* 操作  #jsx。
* 掌握 class 和 function Component。
* state 更新机制， #setState
 和 #useState
 的用法和区别。
* 理解 #props，React 中的 props 可以是什么？
* 类组件生命周期，函数组件生命周期替代方案， #useEffect
 和 #useLayoutEffect
* ### Ref 是什么，能做些什么？
* ### css in React。


### **React优化手段**
* 渲染控制。
* 渲染调优。
* 处理海量数据。
* 细节处理。

### **React生态**
* React-Router。
* React-Redux。
* React-Mobx
* 项目工程 umi | dva等。


### **React设计模式**
* 组合模式。
* render props 模式。
* HOC | 装饰器模式。
* 提供者模式。
* 自定义 hooks 模式。

### **React核心原理**
* 事件原理。
* 调和原理。
* 调度原理。
* hooks 原理。
* diff 流程等等。



### **React实战**
* 实现表单系统。
* 实现状态管理工具。
* 实现路由功能。
* 自定义 hooks 实践。


## JSX
- - - -
老版本的 React 中，为什么写 jsx 的文件要默认引入 React?
如下：
```js
import React from 'react'
function Index(){
    return <div>hello,world</div>
}
```

答：因为 jsx 在被 babel 编译后，写的 jsx 会变成上述 React.createElement 形式，所以需要引入 React，防止找不到 React 引起报错。

- - - -
React.createElement 和 React.cloneElement 到底有什么区别呢?

 可以完全理解为，一个是用来创建 element 。另一个是用来修改 element，并返回一个新的 React.element 对象。


Babel 解析JSX流程

* @babel/plugin-syntax-jsx ： 使用这个插件，能够让 Babel 有效的解析 JSX 语法。
* @babel/plugin-transform-react-jsx ：这个插件内部调用了 @babel/plugin-syntax-jsx，可以把 React JSX 转化成 JS 能够识别的 createElement 格式。

- - - -
新版本的React 已经不需要引入createElement，这种模式来源于 
Automatic Runtime


```jsx
function Index(){
    return <div>
        <h1>hello,world</h1>
        <span>let us learn React</span>
    </div>
}
```

被编译后的文件：

```jsx
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function Index() {
  return  _jsxs("div", {
            children: [
                _jsx("h1", {
                   children: "hello,world"
                }),
                _jsx("span", {
                    children:"let us learn React" ,
                }),
            ],
        });
}
```

plugin-syntax-jsx 已经向文件中提前注入了 _jsxRuntime api。不过这种模式下需要我们在 .babelrc 设置 runtime: automatic 。

```json
"presets": [    
    ["@babel/preset-react",{
    "runtime": "automatic"
    }]     
],
```

**Classic Runtime**

- - - -
Class组件

问：如果没有在 constructor 的 super 函数中传递 props，那么接下来 constructor 执行上下文中就获取不到 props ，这是为什么呢？

```js
/* 假设我们在 constructor 中这么写 */
constructor(){
    super()
    console.log(this.props) // 打印 undefined 为什么?
}
```

绑定 props 是在父类 Component 构造函数中，执行 super 等于执行 Component 函数，此时 props 没有作为第一个参数传给 super() ，在 Component 中就会找不到 props 参数，从而变成 undefined ，在接下来 constructor 代码中打印 props 为 undefined 。


```js
/* 解决问题 */
constructor(props){ 
    super(props)
}
```

上述绑定了两个 handleClick ，那么点击 div 之后会打印什么呢？
```js
class Index extends React.Component{
    constructor(...arg){
       super(...arg)                        /* 执行 react 底层 Component 函数 */
    }
    state = {}                              /* state */
    static number = 1                       /* 内置静态属性 */
    handleClick= () => console.log(111)     /* 方法： 箭头函数方法直接绑定在this实例上 */
    componentDidMount(){                    /* 生命周期 */
        console.log(Index.number,Index.number1) // 打印 1 , 2 
    }
    render(){                               /* 渲染函数 */
        return <div style={{ marginTop:'50px' }} onClick={ this.handerClick }  >hello,React!</div>
    }
}
Index.number1 = 2                           /* 外置静态属性 */
Index.prototype.handleClick = ()=> console.log(222) /* 方法: 绑定在 Index 原型链的 方法*/
```

结果是 111 。因为在 class 类内部，箭头函数是直接绑定在实例对象上的，而第二个 handleClick 是绑定在 prototype 原型链上的，它们的优先级是：实例对象上方法属性 > 原型链对象上方法属性。

- - - -
类组件中的 setState 和函数组件中的 useState 有什么异同？

**相同点：**
* 首先从原理角度出发，setState和 useState 更新视图，底层都调用了 scheduleUpdateOnFiber 方法，而且事件驱动情况下都有批量更新规则。

**不同点**
* 在不是 pureComponent 组件模式下， setState 不会浅比较两次 state 的值，只要调用 setState，在没有其他优化手段的前提下，就会执行更新。但是 useState 中的 dispatchAction 会默认比较两次 state 是否相同，然后决定是否更新组件。
* setState 有专门监听 state 变化的回调函数 callback，可以获取最新state；但是在函数组件中，只能通过 useEffect 来执行 state 变化引起的副作用。
* setState 在底层处理逻辑上主要是和老 state 进行合并处理，而 useState 更倾向于重新赋值。

- - - -
当 props 不变的前提下， PureComponent 组件能否阻止 componentWillReceiveProps 执行？

答案是否定的，componentWillReceiveProps 生命周期的执行，和纯组件没有关系，纯组件是在 componentWillReceiveProps 执行之后浅比较 props 是否发生变化。所以 PureComponent 下不会阻止该生命周期的执行。

- - - -

React.useEffect 回调函数 和 componentDidMount / componentDidUpdate 执行时机有什么区别 ？

useEffect 对 React 执行栈来看是异步执行的，而 componentDidMount / componentDidUpdate 是同步执行的，useEffect代码不会阻塞浏览器绘制。

在时机上 ，componentDidMount / componentDidUpdate 和 useLayoutEffect 更类似。
- - - -

函数组件useEffect实现生命周期的替代方案

**componentDidMount 替代方案**


```js
React.useEffect(()=>{
    /* 请求数据 ， 事件监听 ， 操纵dom */
},[])  /* 切记 dep = [] */
```

这里要记住 dep = [] ，这样当前 effect 没有任何依赖项，也就只有初始化执行一次。

- - - -

**componentWillUnmount 替代方案**

```js
 React.useEffect(()=>{
        /* 请求数据 ， 事件监听 ， 操纵dom ， 增加定时器，延时器 */
        return function componentWillUnmount(){
            /* 解除事件监听器 ，清除定时器，延时器 */
        }
},[])/* 切记 dep = [] */
```

在 componentDidMount 的前提下，useEffect 第一个函数的返回函数，可以作为 componentWillUnmount 使用。


- - - -

在各个生命周期中的应用实例：scrollView

* constructor： 做数据初始化，将滑动处理函数，做防抖处理。
* getDerivedStateFromProps: 将 props 中的 list ，合并到 state 。
* componentDidMount: 绑定监听 scroll 事件。
* shouldComponentUpdate：性能优化，只有 list 改变，渲染视图。
* render: 渲染视图，渲染 Item 。
* getSnapshotBeforeUpdate：保存组件更新前的 scrollview 容器高度。
* componentDidUpdate：根据渲染前后容器高度，计算一次高度变化量。
* componentWillUnmount：解除 scroll 事件监听器。

- - - -
首先明确一个问题是 **DOM 元素**和**组件实例** 必须用 ref 对象获取吗？

答案是否定的，React 类组件提供了多种方法获取 **DOM 元素**和**组件实例**，说白了就是 React 对标签里面 ref 属性的处理逻辑多样化。


- - - -

问： 上面很多同学可能会产生疑问，为什么 ref=“node” 字符串，最后会按照函数方式处理呢。
答： 因为当 ref 属性是一个字符串的时候，React 会自动绑定一个函数，用来处理 ref 逻辑。


```js
const ref = function(value) {
    let refs = inst.refs;
    if (refs === emptyRefsObject) {
        refs = inst.refs = {};
    }
    if (value === null) {
        delete refs[stringRef];
    } else {
        refs[stringRef] = value;
    }
};
```


- - - -
react 被 ref 标记的 fiber，那么每一次 fiber 更新都会调用 **commitDetachRef** 和 **commitAttachRef** 更新 Ref 吗 ？

**答案是否定的，只有在 ref 更新的时候，才会调用如上方法更新 ref ，究其原因还要从如上两个方法的执行时期说起**
- - - -

context 与 props 和 react-redux 的对比？
**答**： 
context解决了：
* 解决了 props 需要每一层都手动添加 props 的缺陷。
* 解决了改变 value ，组件全部重新渲染的缺陷。
* 
react-redux 就是通过 Provider 模式把 redux 中的 store 注入到组件中的。

- - - -
详细介绍一下 useMemo ？

```js
const cacheSomething = useMemo(create,deps)
```

* create：第一个参数为一个函数，函数的返回值作为缓存值，如上 demo 中把 Children 对应的 element 对象，缓存起来。
* deps： 第二个参数为一个数组，存放当前 useMemo 的依赖项，在函数组件下一次执行的时候，会对比 deps 依赖项里面的状态，是否有改变，如果有改变重新执行 create ，得到新的缓存值。
* cacheSomething：返回值，执行 create 的返回值。如果 deps 中有依赖项改变，返回的重新执行 create 产生的值，否则取上一次缓存值。
- - - -

**useMemo原理：**
useMemo 会记录上一次执行 create 的返回值，并把它绑定在函数组件对应的 fiber 对象上，只要组件不销毁，缓存值就一直存在，但是 deps 中如果有一项改变，就会重新执行 create ，返回值作为新的值记录到 fiber 对象上。

**useMemo应用场景：**
* 可以缓存 element 对象，从而达到按条件渲染组件，优化性能的作用。
* 如果组件中不期望每次 render 都重新计算一些值,可以利用 useMemo 把它缓存起来。
* 可以把函数和属性缓存起来，作为 PureComponent 的绑定方法，或者配合其他Hooks一起使用。


- - - -
useCallback# 和useMemo# 有什么区别？

答：useCallback 第一个参数就是缓存的内容，useMemo 需要执行第一个函数，返回值为缓存的内容，比起 useCallback ， useMemo 更像是缓存了一段逻辑，或者说执行这段逻辑获取的结果。那么对于缓存 element 用 useCallback 可以吗，答案是当然可以了。


- - - -

* React 为什么有自己的事件系统？ 

首先，对于不同的浏览器，对事件存在不同的兼容性，React 想实现一个兼容全浏览器的框架， 为了实现这个目标就需要创建一个兼容全浏览器的事件系统，以此抹平不同浏览器的差异

其次，v17 之前 React 事件都是绑定在 document 上，
v17 之后 React 把事件绑定在应用对应的容器 container 上，
将事件绑定在同一容器统一管理，防止很多事件直接绑定在原生的 DOM 元素上。
造成一些不可控的情况。由于不是绑定在真实的 DOM 上，所以 React 需要模拟一套事件流：事件捕获-> 事件源 -> 事件冒泡，也包括重写一下事件源对象 event 。

最后，这种事件系统，大部分处理逻辑都在底层处理了，这对后期的 ssr 和跨端支持度很高。

- - - -


* 什么是事件合成 ？ 

React事件合成的概念：React 应用中，元素绑定的事件并不是原生事件，而是React 合成的事件，比如 onClick 是由 click 合成，onChange 是由 blur ，change ，focus 等多个事件合成。

例如：
发现了 onClick 事件，就会绑定 click 事件，比如发现 onChange 事件，会绑定 [blur，change ，focus ，keydown，keyup] 多个事件。


- - - -
* 如何实现的批量更新？

* 事件系统如何模拟冒泡和捕获阶段？

* 如何通过 dom 元素找到与之匹配的fiber？
* 
* 为什么不能用 return false 来阻止事件的默认行为？
* 
* 事件是绑定在真实的dom上吗？如何不是绑定在哪里？
* 
* V17 对事件系统有哪些改变？


- - - -
问：为什么要用不同的事件插件处理不同的 React 事件?

答：首先对于不同的事件，有不同的处理逻辑；对应的事件源对象也有所不同，React 的事件和事件源是自己合成的，所以对于不同事件需要不同的事件插件处理。


- - - -

* 异步调度原理？
* React 为什么不用 settimeout ？
* 说一说React 的时间分片？
* React 如何模拟 requestIdleCallback？
* 简述一下调度流程？


- - - -
**为什么采用异步调度？**

v15 版本的 React 同样面临着如上的问题，由于对于大型的 React 应用，会存在一次更新，递归遍历大量的虚拟 DOM ，造成占用 js 线程，使得浏览器没有时间去做一些动画效果，伴随项目越来越大，项目会越来越卡。

如何解决以上的问题呢，首先对比一下 vue 框架，vue 有这 template 模版收集依赖的过程，轻松构建响应式，使得在一次更新中，vue 能够迅速响应，找到需要更新的范围，然后以组件粒度更新组件，渲染视图。但是在 React 中，一次更新 React 无法知道此次更新的波及范围，所以 React 选择从根节点开始 diff ，查找不同，更新这些不同。


- - - -

**什么是fiber**

整个 React 团队花费两年时间重构 fiber 架构，目的就是解决大型 React 应用卡顿；fiber 在 React 中是最小粒度的执行单元，无论 React 还是 Vue ，在遍历更新每一个节点的时候都不是用的真实 DOM ，都是采用虚拟 DOM ，所以可以理解成 fiber 就是 React 的虚拟 DOM 。

Reactv16 为了解决卡顿问题引入了 fiber ，为什么它能解决卡顿，更新 fiber 的过程叫做 Reconciler（调和器），每一个 fiber 都可以作为一个执行单元来处理，所以每一个 fiber 可以根据自身的过期时间expirationTime（ v17 版本叫做优先级 lane ）来判断是否还有空间时间执行更新，如果没有时间更新，就要把主动权交给浏览器去渲染，做一些动画，重排（ reflow ），重绘 repaints 之类的事情，这样就能给用户感觉不是很卡。然后等浏览器空余时间，在通过 scheduler （调度器），再次恢复执行单元上来，这样就能本质上中断了渲染，提高了用户体验。
- - - -

element,fiber,dom三种什么关系？

首先必须需要弄明白 React.element ，fiber 和真实 DOM 三者是什么关系。

* element 是 React 视图层在代码层级上的表象，也就是开发者写的 jsx 语法，写的元素结构，都会被创建成 element 对象的形式。上面保存了 props ， children 等信息。
* DOM 是元素在浏览器上给用户直观的表象。
* fiber 可以说是是 element 和真实 DOM 之间的交流枢纽站，一方面每一个类型 element 都会有一个与之对应的 fiber 类型，element 变化引起更新流程都是通过 fiber 层面做一次调和改变，然后对于元素，形成新的 DOM 做视图渲染。

![](React%20%E9%9D%A2%E8%AF%95%E5%87%86%E5%A4%87/0a90368f24f0477aaf0d446a8f6736db_tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

首先先来看一下 element 与 fiber 之间的对应关系。

```js
export const FunctionComponent = 0;       // 对应函数组件
export const ClassComponent = 1;          // 对应的类组件
export const IndeterminateComponent = 2;  // 初始化的时候不知道是函数组件还是类组件 
export const HostRoot = 3;                // Root Fiber 可以理解为跟元素 ， 通过reactDom.render()产生的根元素
export const HostPortal = 4;              // 对应  ReactDOM.createPortal 产生的 Portal 
export const HostComponent = 5;           // dom 元素 比如 <div>
export const HostText = 6;                // 文本节点
export const Fragment = 7;                // 对应 <React.Fragment> 
export const Mode = 8;                    // 对应 <React.StrictMode>   
export const ContextConsumer = 9;         // 对应 <Context.Consumer>
export const ContextProvider = 10;        // 对应 <Context.Provider>
export const ForwardRef = 11;             // 对应 React.ForwardRef
export const Profiler = 12;               // 对应 <Profiler/ >
export const SuspenseComponent = 13;      // 对应 <Suspense>
export const MemoComponent = 14;          // 对应 React.memo 返回的组件
```

- - - -
fiber保存了哪些信息

```js
function FiberNode(){

  this.tag = tag;                  // fiber 标签 证明是什么类型fiber。
  this.key = key;                  // key调和子节点时候用到。 
  this.type = null;                // dom元素是对应的元素类型，比如div，组件指向组件对应的类或者函数。  
  this.stateNode = null;           // 指向对应的真实dom元素，类组件指向组件实例，可以被ref获取。
 
  this.return = null;              // 指向父级fiber
  this.child = null;               // 指向子级fiber
  this.sibling = null;             // 指向兄弟fiber 
  this.index = 0;                  // 索引

  this.ref = null;                 // ref指向，ref函数，或者ref对象。

  this.pendingProps = pendingProps;// 在一次更新中，代表element创建
  this.memoizedProps = null;       // 记录上一次更新完毕后的props
  this.updateQueue = null;         // 类组件存放setState更新队列，函数组件存放
  this.memoizedState = null;       // 类组件保存state信息，函数组件保存hooks信息，dom元素为null
  this.dependencies = null;        // context或是时间的依赖项

  this.mode = mode;                //描述fiber树的模式，比如 ConcurrentMode 模式

  this.effectTag = NoEffect;       // effect标签，用于收集effectList
  this.nextEffect = null;          // 指向下一个effect

  this.firstEffect = null;         // 第一个effect
  this.lastEffect = null;          // 最后一个effect

  this.expirationTime = NoWork;    // 通过不同过期时间，判断任务是否过期， 在v17版本用lane表示。

  this.alternate = null;           //双缓存树，指向缓存的fiber。更新阶段，两颗树互相交替。
}

```

- - - -
**每一个fiber如何建立起关联的**

每一个 element 都会对应一个 fiber ，每一个 fiber 是通过 return ， child ，sibling 三个属性建立起联系的。

* return： 指向父级 Fiber 节点。
* child： 指向子 Fiber 节点。
* sibling：指向兄弟 fiber 节点。

比如项目结构是这样

```js
export default class Index extends React.Component{
   state={ number:666 } 
   handleClick=()=>{
     this.setState({
         number:this.state.number + 1
     })
   }
   render(){
     return <div>
       hello，world
       <p > 《React进阶实践指南》 { this.state.number } 👍  </p>
       <button onClick={ this.handleClick } >点赞</button>
     </div>
   }
}
```
- - - -

**fiber对应的关系如下**

![](React%20%E9%9D%A2%E8%AF%95%E5%87%86%E5%A4%87/5251e320a99f468ca3b46030febaa6b5_tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)


```js


```


- - - -

问：如果如上又发生一次点击，会发生什么？

答：如果进行下一次更新，那么会将 current 的 alternate 作为基础（如图右树），复制一份作为 workInProgresss ，然后进行更新。

- - - -
* ① React Hooks 为什么必须在函数组件内部执行？React 如何能够监听 React Hooks 在外部执行并抛出异常。
* ② React Hooks 如何把状态保存起来？保存的信息存在了哪里？
* ③ React Hooks 为什么不能写在条件语句中？
* ④ useMemo 内部引用 useRef 为什么不需要添加依赖项，而 useState 就要添加依赖项。
* ⑤ useEffect 添加依赖项 props.a ，为什么 props.a 改变，useEffect 回调函数 create 重新执行。
* ⑥ React 内部如何区别 useEffect 和 useLayoutEffect ，执行时机有什么不同


所以 Hooks 出现本质上原因是：
* 1 让函数组件也能做类组件的事，有自己的状态，可以处理一些副作用，能获取 ref ，也能做数据缓存。
* 2 解决逻辑复用难的问题。
* 3 放弃面向对象编程，拥抱函数式编程。


- - - -










- - - -













- - - -