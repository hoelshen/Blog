# history 与 hash 路由策略

## 原始阶段

``` js
  function return () {
    window.location.hash.substr(1)
  }
```

## 两者之间区别

* hash前端路由，无刷新 #
* history  会去请求接口 /

  html5 的 history api
  可以在不刷新页面的前提下动态改变浏览器地址栏中的 url 地址，动态修改页面上所显示资源。
  back() forward() go()
  
  pushState(state, title, url); //添加一条历史记录，不刷新页面
  state: 一个于执行网址相关的状态对象，popstate事件出发时，该对象会传回调函数， 如果不需要这个对象，此处可以填null
  title: 新页面的标题，所有浏览器可以忽略这个值，可以填null
  url: 新的网址，必须与前页面处在同一个域。浏览器的地址将显示这个网址。

  replaceState(state, title, url); 替换当前的历史记录，不刷新页面

  1.popstate事件： 历史记录发生改变时触发，调用history.pushState()或者history.replaceState()时，不会触发popState事件。
  2.hashchange 事件：当页面的hash值改变的时候触发，常用于构建单页面应用。

``` js
  pushState()、 replaceState() 方法接收三个参数： stateObj、 title、 url。

  // 设置状态
  history.pushState({
      color: null
  }, null, "newHistory");

  // 监听状态
  window.onpopstate = function(event) {
      console.log(event.state);
      if (event.state && event.state.color === "newHistory") {
          document.body.style.color = "newHistory";
      }
  }

  // 改变状态
  history.back();
  history.forward();
```

## 构建环境

  1.hash  改变hash不会加载页面
  2.history 修改页面url时，浏览器不会立即向后端发送请求。

## vue-router 提供两种模式的原因

  前端路由的核心：改变视图的同时不会向后端发出请求。
  1.hash： hash 虽然出现在 url 中，但不会被包含 http 请求，
  2.history 能够修改同源下面的任意url，hash只能修改 # 后面的部分，因为只能设置当前url同文档的url。
pushState设置的新url，能与当前一样，这样也会记录添加到栈中，hash设置的新值能不能与原来一样，一样的值不会触发动作将记录添加到栈中。pushstate通过stateObject参数将

history 在刷新页面时，如果服务器中没有相应的响应资源，就会出现404，如果url匹配不到任何静态资源，则应该返回同一个index.html页面。
hash模式下，#之前的内容包含在http请求中，对后端来说，即使没有对路由做到全面覆盖，也不会报404

## react router v5两种模式

##

