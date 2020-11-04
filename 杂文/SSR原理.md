# SSR 原理

## vue ssr 使用
SPA应用采用的是客户端渲染，DOM节点要等待JS文件加载完毕后才会生成，所以就浮现了以上几个问题。

* 内容到达时间(time-to-content)
* seo

目前有 预渲染 和 服务端渲染 这两种方案

## 什么是服务端渲染

当服务器接收到请求后，它把需要的组件渲染成 HTML 字符串，然后把它返回给客户端（这里统指浏览器）。之后，客户端会接手渲染控制权。

## 什么是预渲染（Prerender）

无需使用web 服务器实时动态编译 HTML，而是使用预渲染方式，在构建时 (build time) 简单地生成针对特定路由的静态HTML 文件。

如果项目中使用 webpack，你可以使用 prerender-spa-plugin 轻松地添加预渲染，后面将会具体实现。

## vue ssr 原理

  分为两个 entry, Client entry 和 Server entry 。Client entry 的功能很简单，就是挂载我们的 Vue 实例到指定的 dom 元素上；Server entry 是一个使用export导出的函数。主要负责调用组件内定义的获取数据的方法，获取到SSR渲染所需数据，并存储到上下文环境中。这个函数会在每一次的渲染中重复的调用。

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


## 开发流程： 
```JS
//webpack.config.server.js
  target: 'node',
  entry: path.join(__dirname, '../client/server-entry.js'),
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server-entry.js',
    path: path.join(__dirname, '../server-build')
  },
  new VueServerPlugin()

```

VueServerPlugin 插件能够帮我们不生成 script 脚本，而是生成 json 文件

![项目目录](https://tva1.sinaimg.cn/large/0081Kckwgy1gkb5o5a0l7j30cu0z80t8.jpg)

第一、server.js的作用： 是node服务器启动的文件

isDev 判断开发和生产


处理服务端渲染

我们创建两个文件 dev-ssr 和 ssr，分别对应开发时的服务端渲染情况、上线的服务端渲染情况

第二、dev-ssr.js作用：

1. 拿到 webpack.config.server.js 定义为 serverConfig

在 node 环境去编译webpack，传入 serverConfig

const serverCompiler = webpack(serverConfig)

我们指定了我们的输出目录是在我们的内存里面

我们定义一个 bundle 用来记录 webpack 每次打包生成的文件

```js
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.warn(err))

  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('new bundle generated')
})
```

我们用 vueServerPlugin 生成的文件名默认为 vue-ssr-server-bundle.json

我们根据我们写的 VueServerRenderer 创建一个 serverbundle，生成一个可以直接调用 renderer 的一个 function

我们还要去获取 webpack.config.server.js 帮我们打包出来的 JavaScript 文件的地址， 我们要拿到地址之后才能在我们拼接 html 的时候。把客户端的 js 路径写在里面， 这样我们把 html 返回给浏览器才能够渲染出来可以引用到客户端的 js， 才能够在客户端正式的跑起来，不然只能是空 html
inject 设置为 false ， 因为 vue 会自动诸如一些要符合 vue 的东西.

```js
  const renderer = VueServerRenderer
    .createBundleRenderer(bundle, {
      inject: false,
      clientManifest
    })
```

clientmanifest包含的是js和css的文件名、路径等信息，不是内容信息。

我们通过 axios 拿到相关的 manifest.json, 我们需要在 webpack.client.json 里面引入
VueClientPlugin

```js
 const clientManifestResp = await axios.get(
    'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'
  )
```

服务端渲染的操作
我们创建 server-render.js

```JS
module.exports = async (ctx, renderer, template) => {
  ctx.headers['Content-Type'] = 'text/html'

  const context = { url: ctx.path, user: ctx.session.user }

  try {
    const appString = await renderer.renderToString(context)
  }
}
```

每次服务端渲染都要生成新的 app， 我们不能用上一次渲染过的对象，再去进行下次渲染， 因为这个app 已经包含了上次状态， 会影响我们下次渲染内容, 不这么做的话，会出现内存溢出的风险。

```JS
export default () => {
  const router = createRouter()
  const store = createStore()

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}

```

server.render.js 返回的context 会在 client/server.entry.js 里面接收

```JS
  const appString = await renderer.renderToString(context)
```

我们要主动的 push 我们的路由， router.onready（）只有在服务端渲染的时候才用到，比方说我们有一些异步加载路由的操作。

```js
  router.push(context.url)
```

接着我们配置启动 server.js。 在 dev-ssr.js 导入 server-render.js 在 handleSSR 中进行处理。我们在sever。js 导入dev-ssr

```JS
const router = new Router()
router.get('*', handleSSR)

module.exports = router
```

我们采用nodemon 自动重启服务

concurrently 启动两个服务   "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",

vue-meta 设置我们服务端的元信息

![生产环境](https://tva1.sinaimg.cn/large/0081Kckwgy1gkbancwtjaj32180sqtdz.jpg)




