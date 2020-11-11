# SSR的Cookies问题

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

## 在服务端请求 ssr 首屏数据

最合适的方式是通过 Vuex 的 Store, 在 entry-server.js

```js
      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {

          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        // 并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state

        resolve(app)
      }).catch((err)=>{
        console.error(err)
        reject(err)
      })
```

同时给首屏的第一个路由组件添加 asyncData 方法来请求数据,注意是组件的静态方法,而非在 methods 中定义的方法.

```js
export default {
  name: 'wecircle',
  ...
  asyncData ({ store }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch('setWecircleDataListSSR')
  },
  ...
}
```

后面的 action 和 mutation 按照正常逻辑写即可, 最后, 当 ssr 数据渲染完成后,会在生成的 html 中添加一个 window.__INITIAL_STATE__ 对象, 修改 entry-client.js 可以将数据直接赋值给客户端渲染.

```js
const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
```

## cookie 透传

  当在 ssr 端请求数据时, 需要带上浏览器的 cookie, 在客户端到 ssr 服务器的请求中, 客户端是携带有 cookie 数据的,但是在 ssr 服务器请求后端接口的过程中, 相应的 cookie 数据的, 在 ssr 服务器进行接口请求的时候,我们需要手动那倒客户端的 cookie 传给后端服务器.

我们有个场景就是 需要在请求数据时, 带上 immei 进行登录, 而客户端到 ssr 服务器的请求中, 客户端是携带有 cookie 数据的. 但是在 ssr 服务器 请求后端接口的过程中, 却是没有相应的 immei 数据的, 因此在 ssr 服务器进行接口请求的时候, 我们需要手动拿到客户端的 immei 传给后端服务器.

在 Server.js 中获取浏览器cookie, 并利用 window 对象存储

```js
app.use('*', (req, res) => {
  ...
  window.ssr_cookie = req.cookie
  ...
})
```

```js
在 axios 中, 添加 header 将 cookie 塞进去

axios.create({
  ...
  headers: window.ssr_cookie || {}
  ...
})

```

## 同时支持客户端渲染和服务端渲染

ssr 服务端渲染挂掉的时候, 需要有容错逻辑保证页面可用, 原先的客户端渲染相关的构建要保留, 即通过直接访问 inde.html 的方式能够正常使用页面, 这里通过 nginx 配置路径转发.

```js
location /index.html {
     return 301 https://$server_name/;
}
```

原先通过 http://xxx.com/index.html 变成 http://xxx.com/ .history模式的vue-router的path="/"的路由, 对客户端访问和服务端的访问, 分别设置不同的转发

```sh
 # 客户端渲染服务
  location / {
     # 给静态文件添加缓存
     location ~ .*\.(js|css|png|jpeg)(.*) {
          valid_referers *.nihaoshijie.com.cn;
          if ($invalid_referer) {
            return 404;
          }
          proxy_pass http://localhost:8080;
          expires  3d;# 3天
      }
      proxy_pass http://localhost:8080; # 静态资源走8080端口
  }

  # ssr服务
  location  = /index_ssr {
     proxy_pass http://localhost:8888; # ssr服务使用8888端口
  }
```


只保留/index_ssr 作为 ssr 渲染的入口, 然后在 server.js 中, 将/index_ssr 处理成首页的路径, 并添加对 ssr 渲染的容错逻辑.

```js
  if (req.originalUrl === '/index_ssr' || req.originalUrl === '/index_ssr/') {
    context.url = '/'
  }
  ...
  renderer(bundle, manifest).renderToString(context, (err, html) => {
    ...
    if (err) {
      // 发现报错，直接走客户端渲染
      res.redirect('/')
      // 记录错误信息 这部分内容可以上传到日志平台 便于统计
      console.error(`error during render : ${req.url}`)
      console.error(err)
    }
    ...
  })
```


遇坑1：vue 组件名尽量不要和路由重名，名字一样大小写不一样也不可（例如 组件叫component，而引用这个组建的路由叫/Component）。如果重名了，会出现路由找不到的情况


遇坑2： 一定要遵守标签的嵌套规则，尤其是<router-link>不要单独使用tag="li"属性，嵌套规则的不一致会造成client和server两端的dom树不一致，导致本地开发没问题而打包上线有问题

## cookie 注入

将 Cookies 注入到 global. 在将 cookies 注入到组件的 asyncData 方法.



一套代码两套执行环境

（1）在beforeCreate，created生命周期以及全局的执行环境中调用特定的api前需要判断执行环境；

（2）使用adapter模式，写一套adapter兼容不同环境的api。




```JS
 // 在路由组件内
 <template>
  <div>{{ fooCount }}</div>
 </template>
 <script>
 // 在这里导入模块，而不是在 `store/index.js` 中
 import fooStoreModule from '../store/modules/foo'
 export default {
  // 数据预获取生命周期，在服务端运行
  asyncData ({ store }) {
    //惰性注册store模块
    store.registerModule('foo', fooStoreModule)
    //执行foo命名空间下名为inc的action操作
    return store.dispatch('foo/inc')
  },
  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed () {
    this.$store.unregisterModule('foo')
  },
  computed: {
    fooCount () {
      //获取store数据
      return this.$store.state.foo.count
    }
  }
 }
 </script>
```

因为hash模式的路由提交不到服务器上，因此ssr的路由需要采用history的方式。


异常处理问题
1.异常来自哪里？
（1）服务端数据预获取过程中的异常，如接口请求的各种异常，获取到数据后对数据进行操作的过程中出现的错误异常。

（2）在服务端数据预获取的生命周期结束后的渲染页面过程中出现的异常，包括各种操作数据的语法错误等，如对undefined取属性。


2.怎么处理异常
（1）官方处理方法

抛出500错误页面，体验不友好，产品不接受。

（2）目前采用的方法

a.服务端数据预获取过程中出现的异常，让页面继续渲染，不抛出500异常页面，打错误日志，接入监控。同时，在页面加入标志，让前端页面再次进行一次数据获取页面渲染的尝试。

b.页面渲染过程的异常。由于目前渲染过程是vue提供的一个插件进行的，异常不好捕获，同时出现问题的概率不是很大，因此还没有做专门的处理。

entry-server.js服务端部分：

```JS
 Promise.all(matchedComponents.map(component => {
    //代码略，参见官方文档
 })).then(() => {
    //代码略，参见官方文档
 }).catch(err => {
    //官方代码在这里直接抛出异常，从而走500错误页面
    //我们做如下处理，首先打印错误日志，将日志加入监控报警，监控异常
    console.log('rendererror','entry-server',err);
    // 其次，增加服务端预渲染错误标识，前端拿到标志后重新渲染
    context.serverError = true;
    //最后，将服务端vue实例正常返回，避免抛500
    resolve(app)
 })
```

性能

（1）页面级别的缓存 将渲染完成的页面缓存到内存中，同时设置最大缓存数量和缓存时间。 优势：大幅度提高页面的访问速度 代价：增加服务器内存的使用


```js
 const LRU = require('lru-cache');//删除最近最少使用条目的缓存对象
 // 实例化配置缓存对象
 const microCache = LRU({
  max: 100,//最大存储100条
  maxAge: 1000 // 存储在 1 秒后过期
 })
 //http请求处理
 server.get('*', (req, res) => {
  //根据url获取缓存页面    
  const hit = microCache.get(req.url)
  //如果有缓存则直接返回缓存数据
  if (hit) {
    return res.end(hit)
  }
  renderer.renderToString((err, html) => {
    res.end(html)
    //将页面缓存到缓存对象中
    microCache.set(req.url, html)
  })
 })
```
