# preload 和 prefetch 的详解

  prefetch 是一个声明式 fetch, 可以强制浏览器在不阻塞 document 的 onload 事件的情况下请求资源
  prefetch 告诉浏览器这个资源将来可能需要,但是什么时候加载这个资源是有浏览器来决定的.

正确使用 preload/prefetch 不会造成二次下载, 当页面使用到这个资源时候 preload 资源还没下载完，这时候不会造成二次下载，会等待第一次下载并执行脚本。

可以使用 preload 让 css 样式立即生效吗?
preload 支持基于异步加载的标记, 使用 link rl = 'preload' 的样式表可以使用 onload 事件立即应用于当前文档
对于 preload 来说，一旦页面关闭了，它就会立即停止 preload 获取资源，而对于 prefetch 资源，即使页面关闭，prefetch 发起的请求仍会进行不会中断。

```js
<link rel="preload" href="style.css" onload="this.rel=stylesheet">
```

prefetch 要注意的点

在 Chrome 中，如果用户导航离开一个页面，而对其他页面的预取请求仍在进行中，这些请求将不会被终止。

此外，无论资源的可缓存性如何，prefetch 请求在未指定的网络堆栈缓存中至少保存 5 分钟。

script 脚本资源根据它们在文件中的未知是否异步、延迟或阻塞

## 其他加载方式对比

async、 defer
使用时不阻塞 html 的解析， defer 加载脚本执行会在所有元素解析完成，domContentLoaded 事件触发之前完成执行。它的用途其实跟 preload 十分相似。你可以使用 defer 加载脚本在 head 末尾，这比将脚本放在 body 底部效果来的更好。

preload 只下载资源并不执行,待真正使用到才会执行文件

对于页面上主/首屏脚本，可以直接使用 defer 加载，而对于非首屏脚本/其它资源，可以采用 preload/prefeth 来进行加载。

## HTTP/2 Server Push

HTTP/2 PUSH 功能可以让服务器在没有相应的请求情况下预先将资源推送到客户端。这个跟 preload/prefetch 预加载资源的思路类似，将下载和资源实际执行分离的方法，当脚本真正想要请求文件的时候，发现脚本就存在缓存中，就不需要去请求网络了。

preload  预加载指定资源（加载后并不执行）， 需要执行时在执行。一定会执行。
1.将加载和执行分离开，不堵塞渲染和document的onload事件
2.提前加载制定资源， 不在出现依赖的font 字体隔了一段时间才刷出的情况

link prefetch 是预加载下一页面可能会用到的资源的意思，目的是让浏览器在空闲时间下载或预读取一些文档资源，用户在将来将会访问这些资源。加载优先等级非常低，不一定会执行。

prefetch 和 preload 不要混用

prerender
预渲染
预渲染意味着我们提前加载好用户即将访问的下一个页面
浏览器会帮我们渲染但隐藏指定的页面，一旦我们访问这个页面，则秒开。

不能预加载的场景：
1.url中包含下载资源
2.页面中包含音频、视频
3.post、put等ajax请求
4.http认证authentication
5.https

script defer 页面已加载后才会运行脚本
defer 属性是个布尔值

* 如果 async="async"：脚本相对于页面的其余部分异步地执行（当页面继续进行解析时，脚本将被执行）
* 如果不使用 async 且 defer="defer"：脚本将在页面完成解析时执行
* 如果既不使用 async 也不使用 defer：在浏览器继续解析页面之前，立即读取并执行脚本
