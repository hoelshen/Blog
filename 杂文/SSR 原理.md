# SSR 原理


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

学习成本相对较高
  除了对 webpack、vue 要熟悉，还需要掌握 node、express 相关技术。



















