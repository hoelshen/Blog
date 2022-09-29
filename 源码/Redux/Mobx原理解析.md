# mobx 原理解析

初始化：首先就是 mobx 在初始化的时候，是如何处理 observable 可观察属性的。
依赖收集：第二点就是通过 mobx-react 中的 observer ，如何收集依赖项，与 observable 建立起关系的。
派发更新：最后就是当改变可观察属性的值的时候，如何更新对应组件的。

## 依赖收集和依赖更新

```js
function autorun(
    view: (r: IReactionPublic) => any,
    opts: IAutorunOptions = EMPTY_OBJECT
): IReactionDisposer {
    const name: string = (opts && opts.name) || (view as any).name || "Autorun@" + getNextId()
    const runSync = !opts.scheduler && !opts.delay
    let reaction: Reaction


    // 只看同步的autorun，异步是根据传入的delay setTimeout
    if (runSync) {
        // normal autorun
        reaction = new Reaction(
            name,
            // reaction的onInvalidate， 用track调用reactionRunner， 也就是view(reaction)， （重新）收集依赖
            function(this: Reaction) {
                this.track(reactionRunner)
            },
            opts.onError,
            opts.requiresObservable
        )
    } else {
       // ... 处理异步
    }

    function reactionRunner() {
        view(reaction)
    }
    // 将 reaction 放进全局 globalState.pendingReactions 队列，里面会执行runReactions
    reaction.schedule()
    // 返回取消订阅
    return reaction.getDisposer()
}

```

runReactions, runReactions 是依赖收集启动方法

```js
let reactionScheduler (fn: () => void) => void = f => f();

function runReactions() {
  // 不在事务中并且没有正在执行的reaction
  if (globalState.inBatch > 0 || globalState.isRunningReactions) return
  // 核心的调用runReactionsHelper
  reactionScheduler(runReactionsHelper)
}
```

runReactionsHelper

```js
function runReactionsHelper() {
  globalState.isRunningReactions = true;
  const allReactions = globalState.pendingReactions;
  let iterations = 0;

  // 遍历所有globalState.pendingReactions中的reaction，并执行每个对象的runReaction
  while (allReactions.length > 0) {
    if (++iterations === MAX_REACTION_ITERATIONS) {
      console.error(
        `Reaction doesn't converge to a stable state after ${MAX_REACTION_ITERATIONS} iterations.` +
          ` Probably there is a cycle in the reactive function: ${allReactions[0]}`
      );
      allReactions.splice(0); // clear reactions
    }
    let remainingReactions = allReactions.splice(0);
    for (let i = 0, l = remainingReactions.length; i < l; i++)
      remainingReactions[i].runReaction();
  }
  globalState.isRunningReactions = false;
}
```

## provider 源码分析

```js
var MobXProviderContext =
  /*#__PURE__*/
  React__default.createContext({});
function Provider(props) {
  var children = props.children,
    stores = _objectWithoutPropertiesLoose(props, ["children"]); // 获取除去children后的props对象

  var parentValue = React__default.useContext(MobXProviderContext);
  // `useRef`返回一个可变的 ref 对象，其`.current`属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内保持不变。
  var mutableProviderRef = React__default.useRef(
    _extends({}, parentValue, {}, stores)
  );
  var value = mutableProviderRef.current;

  if (process.env.NODE_ENV !== "production") {
    var newValue = _extends({}, value, {}, stores); // spread in previous state for the context based stores

    if (!shallowEqual(value, newValue)) {
      throw new Error(
        "MobX Provider: The set of provided stores has changed. See: https://github.com/mobxjs/mobx-react#the-set-of-provided-stores-has-changed-error."
      );
    }
  }

  return React__default.createElement(
    MobXProviderContext.Provider,
    {
      value: value,
    },
    children
  );
}
Provider.displayName = "MobXProvider";
```
