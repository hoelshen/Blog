## 什么是h

```js
new Vue({
 render: h => h(App)
}).$mount('#app')

```

h 是用来干嘛的？它表示什么意思呢？ h 代表的是 hyperscript 。它是 HTML 的一部分，表示的是 超文本标记语言：当我们正在处理一个脚本的时候，在虚拟 DOM 节点中去使用它进行替换已成为一种惯例。

```js

render: function (createElement) {
  return createElement(App);
}

render: h => h (App)

render(h) {
  return h('div', {}, [...])
}
```

1. 第一个是元素的类型 元素的类型
2. 第二个是数据对象 ：props, attrs, dom props, class 和 style.
3. 第三个是一组子节点

这实际上是引用这个库 HyperScript 的
[HyperScript](https://github.com/hyperhype/hyperscript#ecosystem)

```js
var h = require('hyperscript')
h('div#page',
  h('div#header',
    h('h1.classy', 'h', { style: {'background-color': '#22f'} })),
  h('div#menu', { style: {'background-color': '#2f2'} },
    h('ul',
      h('li', 'one'),
      h('li', 'two'),
      h('li', 'three'))),
    h('h2', 'content title',  { style: {'background-color': '#f22'} }),
    h('p',
      "so it's just like a templating engine,\n",
      "but easy to use inline with javascript\n"),
    h('p',
      "the intention is for this to be used to create\n",
      "reusable, interactive html widgets. "))

```

```js
var h = require('hyperscript')
var obj = {
  a: 'Apple',
  b: 'Banana',
  c: 'Cherry',
  d: 'Durian',
  e: 'Elder Berry'
}
h('table',
  h('tr', h('th', 'letter'), h('th', 'fruit')),
  Object.keys(obj).map(function (k) {
    return h('tr',
      h('th', k),
      h('td', obj[k])
    )
  })
)




```
