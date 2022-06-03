# SSR 原理

## vue ssr 使用

SPA应用采用的是客户端渲染，DOM节点要等待JS文件加载完毕后才会生成，所以就浮现了以上几个问题。

* 内容到达时间(time-to-content)
* seo

目前有 预渲染 和 服务端渲染 这两种方案

## 什么是服务端渲染

SSR模式下，后端拦截到路由，找到对应组件，准备渲染组件，所有的JS资源在本地，排除了JS资源的网络加载时间，接着只需要对当前路由的组件进行渲染，而页面的ajax请求，可能在同一台服务器上，如果是的话速度也会快很多。最后后端把渲染好的页面反回给前端。

注意：页面能很快的展示出来，但是由于当前返回的只是单纯展示的DOM、CSS，其中的JS相关的事件等在客户端其实并没有绑定，所以最终还是需要JS加载完以后，对当前的页面再进行一次渲染，称为同构。 所以SSR就是更快的先展示出页面的内容，先让用户能够看到。

两种技术有大量可重用的代码，客户端路由、服务器端路由、客户端Redux、服务器端Redux等，最大程度的复用这些代码，就是同构

--------------------------------------------------------------------------------------------------------

服务端渲染是相对于客户端渲染而言的(Client Side Render), 它的渲染行为发生在服务器端, 渲染完成之后再将完整页面以HTML字符串的形式交给浏览器, 最后经过『注水』hydrate过程将一些事件绑定和Vue状态等注入到输出的静态的页面中, 由同步下发给浏览器的的Vue bundle接管状态, 继续处理接下来的交互逻辑. 这也是一种同构应用的实现(代码可以运行在客户端和服务端中).

## 什么是预渲染（Prerender）

无需使用 web 服务器实时动态编译 HTML，而是使用预渲染方式，在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。

如果项目中使用 webpack，你可以使用 prerender-spa-plugin 轻松地添加预渲染，后面将会具体实现。

Prerender 原理是在构建阶段就将 html 页面渲染完毕，不会进行二次渲染，也就是说，当初打包时页面是怎么样，那么预渲染就是什么样，如果页面上有数据实时更新，那么浏览器第一次加载的时候只会渲染当时的数据，等到 JS 下载完毕再次渲染的时候才会更新数据更新，会造成数据延迟的错觉。

## vue ssr 原理

  分为两个 entry, Client entry 和 Server entry 。Client entry 的功能很简单，就是挂载我们的 Vue 实例到指定的 dom 元素上；Server entry 是一个使用export导出的函数。主要负责调用组件内定义的获取数据的方法，获取到SSR渲染所需数据，并存储到上下文环境中。这个函数会在每一次的渲染中重复的调用。

我们通过 webpack 生成 server Bundle 和 Client Bundle,  前端会进行在服务器上通过 node 生成预渲染的 html 字符串,发送到我们的客户端以便完成初始化渲染; 而客户端 bundle 就自由了, 初始化渲染完全不依赖它.客户端拿到服务端返回的 html 字符串后, 会去"激活"这些静态 html, 使其变成由 vue 动态管理的 dom, 以便响应后续数据的变化.

## 构建逻辑

  在vue-SSR中，会将代码打包分成两个部分： 服务端：bundle，客户端：bundle，Node.js会处理服务端bundle用于SSR，客户端bundle会在用户请求时和已经由SSR渲染出的页面一起返回给用户，然后在浏览器执行『注水』，接管Vue接下来的业务逻辑。

**这里就会有一个问题, 服务端是如何将store状态交给客户端的呢, 因为整个构建流程是彼此独立的, 数据预取(在进入渲染页面之前获取到页面所需要的数据)之后交给了store, 而注水过程怎么接收store数据?**

window.**INITIAL_STATE**, 这个 state 会在服务端渲染执行 context.state = store.state;的时候自动写入window中, 所以在客户端代码中就就可以直接通过 store.replaceState() 接收服务端预取的数据了.

## 剖析流程

node 服务器启动, 跑服务端 entry 里的函数,将构建好的 vue 实例渲染成 html 字符串,然后将拿到的数据混入（注入）我们的 html 字符串中,最后发送到我们客户端.

里面有初始化的 dom 结构, 有 css, 还有一个 script 标签. script 标签里把我们在服务端 entry 拿到的数据挂载了 window 上.
服务端的 vue 只是混入了个数据渲染了静态页面,客户端的 vue 才是去实现交互的!

![挂载在 window 上的数据](https://tva1.sinaimg.cn/large/007S8ZIlgy1gjpv54pha9j30oe09ljri.jpg)

SSR 独特之处
  在 ssr 中, 创建 vue 实例, 创建 store 和 创建 router 都是套了一层工厂函数的, 目的就是避免数据的交叉污染.
  在服务端只能执行生命周期中的 created 和 beforeCreated,原因是在服务端是无法操作 dom 的, 所以其他周期无法执行.

ssr 服务端请求不带 cookie, 需要手动拿到浏览器的 cookie 传给服务端的请求.

ssr 要求dom 结构规范, 因为浏览器会自动给 html 添加一些结构比如 tbody,但是客户端进行混淆服务端放回的 html 时,不会添加这些标签,导致混淆后的 html 和浏览器渲染的 html 不匹配

----------------------------------------------------------------------------------------------

SSR的核心思路就是使用vue-server-renderer创建一个渲染器(renderer), 然后给这个渲染器传入Vue实例, 渲染器会得到HTML页面, 最后由Egg.js将HTML返回, 实现代码有些繁杂这

// 第 1 步：创建一个 Vue 实例
const app = new Vue({ template: `<div>Hello World</div>` })

// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer()

// 第 3 步：将 Vue 实例渲染为 HTML
const html = await renderer.renderToString(app)

// 第 4 步, 返回 HTML
this.ctx.body = await this.ctx.renderString(html)

## 开发流程

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

我们通过 axios 拿到相关的 manifest.json, 我们需要在 webpack.client.json 里面引入 VueClientPlugin

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

**每次服务端渲染都要生成新的 app， 我们不能用上一次渲染过的对象，再去进行下次渲染， 因为这个app 已经包含了上次状态， 会影响我们下次渲染内容, 不这么做的话，会出现内存溢出的风险。**

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

concurrently 启动两个服务

```js
   "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
```

vue-meta 设置我们服务端的元信息

![生产环境](https://tva1.sinaimg.cn/large/0081Kckwgy1gkbancwtjaj32180sqtdz.jpg)

## 后端登录接口实现以及 session 的使用

前端 Node 引入  Koa-session 生成客户状态机制

当浏览器访问服务器并发送第一次请求时，服务器端会创建一个session对象，生成一个类似于key,value的键值对， 然后将key(cookie)返回到浏览器(客户)端，浏览器下次再访问时，携带key(cookie)，找到对应的session(value)。 客户的信息都保存在session中

```js
const KoaSeesion = require('koa-session')
```

## react ssr原理

实现思想
核心实现分为以下几步：

1. 后端拦截路由，根据路径找到需要渲染的react页面组件X
2. 调用组件X初始化时需要请求的接口，同步获取到数据后，使用react的renderToString方法对组件进行渲染，使其渲染出节点字符串。
3. 后端获取基础HTML文件，把渲染出的节点字符串插入到body之中，同时也可以操作其中的title，script等节点。返回完整的HTML给客户端。
4. 客户端获取后端返回的HTML，展示并加载其中的JS，最后完成react同构。

1。 注册路由 配置路由路径和组件的映射，使其能够被客户端路由和服务端路由同时调用

```js
import Index from "../pages/index";
import List from "../pages/list";

const routers = [
  { exact: true, path: "/", component: Index },
  { exact: true, path: "/list", component: List }
];

//注册页面和引入组件，存在对象中，server路由匹配后渲染
export const clientPages = (() => {
  const pages = {};
  routers.forEach(route => {
    pages[route.path] = route.component;
  });
  return pages;
})();
export default routers;


```

服务端

```JS
import { clientPages } from "./../../client/router/pages";

router.get("*", (ctx, next) => {
    let component = clientPages[ctx.path];
    if (component) {
        const data = await component.getInitialProps();
        //因为component是变量，所以需要create
        const dom = renderToString(
            React.createElement(component, {
                ssrData: data
            })
        )
    }
})

```

匹配到组件以后，执行了组件的getInitialProps方法，此方法是一个封装的静态方法，主要用于获取初始化所需要的ajax数据，在服务端会同步获取，而后通过ssrData参数传入组件props并执行组件渲染。 此方法在客户端依然是异步请求。

2. 客户端渲染

```JS
import React from "react";
export default class Base extends React.Component {
  //override 获取需要服务端首次渲染的异步数据，也可以是api请求
  static async getInitialProps() {
    return null;
  }
  static title = "react ssr";
  //page组件中不要重写constructor
  constructor(props) {
    super(props);
    //如果定义了静态state,按照生命周期，state应该优先于ssrData 
   if (this.constructor.state) {
      this.state = {
        ...this.constructor.state
      };
    }
    //如果是首次渲染，会拿到ssrData
    if (props.ssrData) {
      if (this.state) {
        this.state = {
          ...this.state,
          ...props.ssrData
        };
      } else {
        this.state = {
          ...props.ssrData
        };
      }
    }
  }
  async componentWillMount() {
    //客户端运行时
    if (typeof window != "undefined") {
      if (!this.props.ssrData) {
        //静态方法，通过构造函数获取
        const data = await this.constructor.getInitialProps();
        if (data) {
          this.setState({ ...data });
        }
      }
      //设置标题
      document.title = this.constructor.title;
    }
  }
}

```
