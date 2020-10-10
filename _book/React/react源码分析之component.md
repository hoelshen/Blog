# Component

## 在源码里面分析

```js
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}
```

context 和 prop 是我们比较熟悉的东西

进入到里面 我们可以看到这段代码

```js
Component.prototype.setState = function(partialState, callback) {
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```

## pureCompontent

大体跟component 差不多 唯一的区别就是 多了个

```js
const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
```

isPureReactComponent 根据prop 判断是否需要更新

ReactCurrentOwner.current 指的是

就是你这个组件是在哪个组件内被渲染的，比如你有一个组件A：

<B><C/></B>

对于C来说，B是他的父组件，而A就是owner
