#




其中16.3版本和16.4版本的生命周期稍有不同，首先我们一起来16.4版本的流程图



1.React 16.4版本中getDerivedStateFromProps()在父组件更新接受props,组件自身调用setState()函数以及forceUpdate()函数执行时都会被触发
2.React 16.3在更新阶段只有父组件更新才会触发。

## 初始化 




## 挂载



## 卸载

```js

UNSAFE_componentWillMount、
UNSAFE_componentWillReceiveProps
UNSAFE_componentWillUpdate

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