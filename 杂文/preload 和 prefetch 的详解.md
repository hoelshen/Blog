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

preload 只下载资源并不执行,待真正使用到才会执行文件

对于页面上主/首屏脚本，可以直接使用 defer 加载，而对于非首屏脚本/其它资源，可以采用 preload/prefeth 来进行加载。


