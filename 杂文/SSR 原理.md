# SSR 原理

## vue ssr 使用
SPA应用采用的是客户端渲染，DOM节点要等待JS文件加载完毕后才会生成，所以就浮现了以上几个问题。

* 内容到达时间(time-to-content)
* seo

目前有 预渲染 和 服务端渲染 这两种方案

## 什么是服务端渲染
当服务器接收到请求后，它把需要的组件渲染成 HTML 字符串，然后把它返回给客户端（这里统指浏览器）。之后，客户端会接手渲染控制权。

## 什么是预渲染（Prerender）？
无需使用web 服务器实时动态编译 HTML，而是使用预渲染方式，在构建时 (build time) 简单地生成针对特定路由的静态HTML 文件。

如果项目中使用 webpack，你可以使用 prerender-spa-plugin 轻松地添加预渲染，后面将会具体实现。



## vue ssr 原理
  分为两个 entry, Client entry和Server entry。Client entry的功能很简单，就是挂载我们的Vue实例到指定的dom元素上；Server entry是一个使用export导出的函数。主要负责调用组件内定义的获取数据的方法，获取到SSR渲染所需数据，并存储到上下文环境中。这个函数会在每一次的渲染中重复的调用。

我们通过 webpack 生成 server Bundle 和 Client Bundle,  前端会进行在服务器上通过 node 生成预渲染的 html 字符串,发送到我们的客户端以便完成初始化渲染; 而客户端 bundle 就自由了, 初始化渲染完全不依赖它.客户端拿到服务端返回的 html 字符串后, 会去"激活"这些静态 html, 使其变成由 vue 动态管理的 dom, 以便响应后续数据的变化.


## 剖析流程

node 服务器启动, 跑服务端 entry 里的函数,将构建好的 vue 实例渲染成 html 字符串,然后将拿到的数据混入我们的 html 字符串中,最后发送到我们客户端.

里面有初始化的 dom 结构, 有 css, 还有一个 script 标签. script 标签里把我们在服务端 entry 拿到的数据挂载了 window 上.
服务端的 vue 只是混入了个数据渲染了静态页面,客户端的 vue 才是去实现交互的!

![挂载在 window 上的数据](https://tva1.sinaimg.cn/large/007S8ZIlgy1gjpv54pha9j30oe09ljri.jpg)

SSR 独特之处
  在 ssr 中, 创建 vue 实例, 创建 store 和 创建 router 都是套了一层工厂函数的, 目的就是避免数据的交叉污染.
  在服务端只能执行生命周期中的 created 和 beforeCreated,原因是在服务端是无法操作 dom 的, 所以其他周期无法执行.

ssr 服务端请求不带 cookie, 需要手动拿到浏览器的 cookie 传给服务端的请求.

ssr 要求dom 结构规范, 因为浏览器会自动给 html 添加一些结构比如 tbody,但是客户端进行混淆服务端放回的 html 时,不会添加这些标签,导致混淆后的 html 和浏览器渲染的 html 不匹配.

## 常见的性能问题

  vue.mixin、axios拦截请求使用不当，会内存泄露。
  lru-cache 向内存缓存数据， 需要合理混存改动不频繁的资源。

ssr 的局限
服务端压力较大


开发条件受限
  在服务端渲染中，created 和 beforeCreated 之外的生命周期钩子不可用，因此项目引用的第三方的库也不用其他生命周期钩子，这对引用库的选择产生了很大的限制。
  一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行。
你应该避免在 beforeCreate 和 created 生命周期时产生全局副作用的代码，例如在其中使用 setInterval 设置 timer。在纯客户端 (client-side only) 的代码中，我们可以设置一个 timer，然后在 beforeDestroy 或 destroyed 生命周期时将其销毁。为了避免这种情况，请将副作用代码移动到 beforeMount 或 mounted 生命周期中。

## 访问特定平台(Platform-Specific) API

## 自定义指令

大多数自定义指令直接操作 DOM，因此会在服务器端渲染 (SSR) 过程中导致错误。有两种方法可以解决这个问题：

推荐使用组件作为抽象机制，并运行在「虚拟 DOM 层级(Virtual-DOM level)」（例如，使用渲染函数(render function)）。

如果你有一个自定义指令，但是不是很容易替换为组件，则可以在创建服务器 renderer 时，使用 directives 选项所提供"服务器端版本(server-side version)"。

学习成本相对较高
  除了对 webpack、vue 要熟悉，还需要掌握 node、express 相关技术。

## 避免状态单例

当编写纯客户端 (client-only) 代码时，我们习惯于每次在新的上下文中对代码进行取值。但是，Node.js 服务器是一个长期运行的进程。当我们的代码进入该进程时，它将进行一次取值并留存在内存中。这意味着如果创建一个单例对象，它将在每个传入的请求之间共享。

每个请求创建一个新的根 Vue 实例.

应用程序的代码分割或惰性加载，有助于减少浏览器在初始渲染中下载的资源体积，可以极大地改善大体积 bundle 的可交互时间(TTI - time-to-interactive)




Simple fix is adding a flag on Vue to make sure you only apply the mixin once.

## cookie 透传
  当在 ssr 端请求数据时, 需要带上浏览器的 cookie, 在客户端到 ssr 服务器的请求中, 客户端是携带有 cookie 数据的,但是在 ssr 服务器请求后端接口的过程中, 相应的 cookie 数据的, 在 ssr 服务器进行接口请求的时候,我们需要手动那倒客户端的 cookie 传给后端服务器.
```js
app.use('*', (req, res) => {
  ...
  window.ssr_cookie = req.cookie
  ...
})
```

```js
axios.create({
  ...
  headers: window.ssr_cookie || {}
  ...
})
```














