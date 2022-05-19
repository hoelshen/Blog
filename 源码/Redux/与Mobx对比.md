# Mobx和Redux对比

   Redux和Mobx的区别

## Redux

## Mobx

Mobx是一个透明函数响应式编程（Transparently Functional Reactive Programming，TFRP）的状态管理库，它使得状态管理简单可伸缩：

![Mobx模型流程](https://tva1.sinaimg.cn/large/007S8ZIlgy1gj6rrgl9zyj31330dfjsl.jpg)

## 区别

* Redux 带来了函数式编程、不可变性思想等理念。为了遵循这些理念，开发者必须写很多“模式代码（ boilerplate ）”，烦琐以及重复是开发者不愿容忍的。当然也有很多 hack 旨在减少样板模式，但目前可以说 Redux 天生就带着烦琐.

* 应用需要使用 object 或者 array 描述状态
* 应用需要使用 plain object 类型的 action 来描述变化
* 应用需要使用纯函数来处理变化
以上种种限制， 使得开发者很难痛痛快快地编写业务代码， 一旦发生任何变化，就要对应地编写 action ( action creator ）、 reducer 等，这样一来，和偏响应式的解决方案如 MobX 相比，编程体验会打折扣。

### 函数式和面向对象

Redux更多的是遵循函数式编程（Functional Programming, FP）思想，而Mobx则更多从面相对象角度考虑问题。

Redux提倡编写函数式代码，如reducer就是一个纯函数（pure function），如下：

```js
(state, action) => {
  return Object.assign({}, state, {
    ...
  })
}
```

函数，接受输入，然后输出结果，除此之外不会有任何影响，也包括不会影响接收的参数；对于相同的输入总是输出相同的结果。
Mobx设计更多偏向于面向对象编程（OOP）和响应式编程（Reactive Programming），通常将状态包装成可观察对象，于是我们就可以使用可观察对象的所有能力，一旦状态对象变更，就能自动获得更新。

## 单一 store 和多 store

store是应用管理数据的地方，在Redux应用中，我们总是将所有共享的应用数据集中在一个大的store中，而Mobx则通常按模块将应用状态划分，在多个独立的store中管理。

## JavaScript对象和可观察对象

Redux默认以JavaScript原生对象形式存储数据，而Mobx使用可观察对象：

Redux需要手动追踪所有状态对象的变更；
Mobx中可以监听可观察对象，当其变更时将自动触发监听；

## 不可变（Immutable）和可变（Mutable）

Redux状态对象通常是不可变的（Immutable）：

```js
switch (action.type) {
  case REQUEST_POST:
  	return Object.assign({}, state, {
      post: action.payload.post
  	});
  default:
    retur nstate;
}
```

复制代码我们不能直接操作状态对象，而总是在原来状态对象基础上返回一个新的状态对象，这样就能很方便的返回应用上一状态；而Mobx中可以直接使用新值更新状态对象

## Reconil

组件状态只能通过往上推送至公共祖先来进行共享，这可能包含一个巨大的树，随后这个树需要重新渲染。

Context只能存储一个值，而不能存储一组不确定的值，让每个值都有自己的消费者。

以上两点使得将树的顶部（状态必须要存在的地方）与树的叶子（状态被使用的地方）进行代码分离变得非常困难。

## Mobx的状态管理的用法

以下是mbox的具体用法

```js
import {observable, autorun} from 'mobx';

var todoStore = observable({
    /* some observable state */
    todos: [],

    /* a derived value */
    get completedCount() {
        return this.todos.filter(todo => todo.completed).length;
    }
});

/* a function that observes the state */
autorun(function() {
    console.log("Completed %d of %d items",
        todoStore.completedCount,
        todoStore.todos.length
    );
});

/* ..and some actions that modify the state */
todoStore.todos[0] = {
    title: "Take a walk",
    completed: false
};
// -> synchronously prints: 'Completed 0 of 1 items'

todoStore.todos[0].completed = true;
// -> synchronously prints: 'Completed 1 of 1 items'
```
