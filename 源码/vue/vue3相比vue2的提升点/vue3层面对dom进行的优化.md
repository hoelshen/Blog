# vue3的虚拟dom优化

## 编译模板的静态标记

    ```JS
    <div id="app">
    <h1>技术摸鱼</h1>
    <p>今天天气真不错</p>
    <div>{{name}}</div>

</div>

    ```

在vue2.x中会解析成

```JS
function render() {
  with(this) {
    return _c('div', {
      attrs: {
        "id": "app"
      }
    }, [_c('h1', [_v("技术摸鱼")]), _c('p', [_v("今天天气真不错")]), _c('div', [_v(
      _s(name))])])
  }
}


```

其中前面两个标签是完全静态的，后续的渲染中不会产生任何变化，vue2中依然可以使用_c新建成vdom，在diff的时候需要对比，有一些额外的性能损耗

```JS
import { createVNode as _createVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createBlock as _createBlock } from "vue"

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", { id: "app" }, [
    _createVNode("h1", null, "技术摸鱼"),
    _createVNode("p", null, "今天天气真不错"),
    _createVNode("div", null, _toDisplayString(_ctx.name), 1 /* TEXT */)
  ]))
}
// Check the console for the AST


```

最后一个_createVNode第四个参数1，只有带这个参数的，才会被真正的追踪，静态节点不需要遍历，这个就是vue3优秀性能的主要来源，再看复杂一点的

```js

import { createVNode as _createVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createBlock as _createBlock } from "vue"

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", { id: "app" }, [
    _createVNode("h1", null, "技术摸鱼"),
    _createVNode("p", null, "今天天气真不错"),
    _createVNode("div", null, _toDisplayString(_ctx.name), 1 /* TEXT */),
    _createVNode("div", {
      class: {red:_ctx.isRed}
    }, "摸鱼符", 2 /* CLASS */),
    _createVNode("button", { onClick: _ctx.handleClick }, "戳我", 8 /* PROPS */, ["onClick"])
  ]))
}

// Check the console for the AST

```

_createVNode出第四个参数出现了别的数字，根据后面注释也很容易猜出，根据text，props等不同的标记，这样再diff的时候，只需要对比text或者props，不用再做无畏的props遍历, 优秀！ 借鉴一下劝退大兄弟的注释

```js
export const enum PatchFlags {
  
  TEXT = 1,// 表示具有动态textContent的元素
  CLASS = 1 << 1,  // 表示有动态Class的元素
  STYLE = 1 << 2,  // 表示动态样式（静态如style="color: red"，也会提升至动态）
  PROPS = 1 << 3,  // 表示具有非类/样式动态道具的元素。
  FULL_PROPS = 1 << 4,  // 表示带有动态键的道具的元素，与上面三种相斥
  HYDRATE_EVENTS = 1 << 5,  // 表示带有事件监听器的元素
  STABLE_FRAGMENT = 1 << 6,   // 表示其子顺序不变的片段（没懂）。 
  KEYED_FRAGMENT = 1 << 7, // 表示带有键控或部分键控子元素的片段。
  UNKEYED_FRAGMENT = 1 << 8, // 表示带有无key绑定的片段
  NEED_PATCH = 1 << 9,   // 表示只需要非属性补丁的元素，例如ref或hooks
  DYNAMIC_SLOTS = 1 << 10,  // 表示具有动态插槽的元素
}
```

## 事件缓存

```js
<div id="app">
  <button @click="handleClick">戳我</button>
</div>

```

```JS

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", { id: "app" }, [
    _createVNode("button", {
      onClick: _cache[1] || (_cache[1] = $event => (_ctx.handleClick($event)))
    }, "戳我")
  ]))
}


```

传入的事件会自动生成并缓存一个内联函数再cache里，变为一个静态节点。这样就算我们自己写内联函数，也不会导致多余的重复渲染 真是优秀啊

## 静态提升

```JS
<div id="app">
    <h1>技术摸鱼</h1>
    <p>今天天气真不错</p>
    <div>{{name}}</div>
    <div :class="{red:isRed}">摸鱼符</div>
</div>

```

```JS
const _hoisted_1 = { id: "app" }
const _hoisted_2 = _createVNode("h1", null, "技术摸鱼", -1 /* HOISTED */)
const _hoisted_3 = _createVNode("p", null, "今天天气真不错", -1 /* HOISTED */)

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", _hoisted_1, [
    _hoisted_2,
    _hoisted_3,
    _createVNode("div", null, _toDisplayString(_ctx.name), 1 /* TEXT */),
    _createVNode("div", {
      class: {red:_ctx.isRed}
    }, "摸鱼符", 2 /* CLASS */)
  ]))
}


```

Vue3通过Proxy响应式+组件内部vdom+静态标记，把任务颗粒度控制的足够细致，所以也不太需要time-slice
