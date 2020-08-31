# vue 源码分析之 mixins
  mixins 的主要作用是让我们将组件可复用功能抽取出来,放入mixin中, 然后在组件中引入mixin.
  mixins 理解成一个数组，数组中有单或多个 mixin，mixin 的本质就是一个 JS 对象，它可以有 data、created、methods 等等 vue 实例中拥有的所有属性，甚至可以在 mixins 中再次嵌套 mixins.

## mixin  的使用


## mixins实现

```js
export function mergeOptions(
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  ...
  // 如果有 child.extends 递归调用 mergeOptions 实现属性拷贝
  const extendsFrom = child.extends
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm)
  }
  // 如果有 child.mixins 递归调用 mergeOptions 实现属性拷贝
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
  // 申明 options 空对象，用来保存属性拷贝结果
  const options = {}
  let key
  // 遍历 parent 对象，调用 mergeField 进行属性拷贝
  for (key in parent) {
    mergeField(key)
  }
  // 遍历 parent 对象，调用 mergeField 进行属性拷贝
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  // 属性拷贝实现方法
  function mergeField(key) {
    // 穿透赋值，默认为 defaultStrat
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}

```

```JS
const extendsFrom = child.extends
if (extendsFrom) {
  parent = mergeOptions(parent, extendsFrom, vm)
}

```
首先申明 extendsFrom 变量保存 child.extends，如果 extendsFrom 为真，递归调用 mergeOptions 进行属性拷贝，并且将 merge 结果保存到 parent 变量。

```JS
if (child.mixins) {
  for (let i = 0, l = child.mixins.length; i < l; i++) {
    parent = mergeOptions(parent, child.mixins[i], vm)
  }
}
```
如果 child.mixins 为真，循环 mixins 数组，递归调用 mergeOptions 实现属性拷贝，仍旧将 merge 结果保存到 parent 变量。

```JS
function mergeField(key) {
  // 穿透赋值，默认为 defaultStrat
  const strat = strats[key] || defaultStrat
  options[key] = strat(parent[key], child[key], vm, key)
}
```
mergeField 函数接收一个 key，首先会申明 strat 变量，如果 strats[key] 为真，就将 strats[key] 赋值给 strat。

```JS
const strats = config.optionMergeStrategies
optionMergeStrategies: Object.create(null),

```
strats 其实就是 Object.create(null)，Object.create 用来创建一个新对象，strats 默认是调用 Object.create(null) 生成的空对象。

```js
const defaultStrat = function(parentVal: any, childVal: any): any {
  return childVal === undefined ? parentVal : childVal
}
```

defaultStrat 函数返回一个三元表达式，如果 childVal 为 undefined，返回 parentVal，否则返回 childVal，这里主要以 childVal 优先，这也是为什么有 component > mixins > extends 这样的优先级。

mergeField 函数最后会将调用 strat 的结果赋值给 options[key]。
mergeOptions 函数最后会 merge 所有 options、 mixins、 extends，并将 options 对象返回，然后再去实例化 vue

钩子函数的合并
```js
function mergeHook(
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
      ? childVal
      : [childVal]
    : parentVal
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})


```
