# coop 和 coep
浏览器天然支持是一些安全策略(同源策略),但是同源策略也有一些例外，任何网站都可以不受限制的加载下面的资源：

* 嵌入跨域 iframe
* image、script 等资源
* 使用 DOM 打开跨域弹出窗口


## COOP: Cross Origin Opener Policy：跨源开放者政策

Cross-Origin-Resource-Policy: same-site | same-origin | cross-origin;

例如，如果带有 COOP 的网站打开一个新的跨域弹出页面，则其 window.opener 属性将为 null 。

## coop



## CORP: Cross Origin Resource Policy：跨源资源策略

Cross-Origin-Resource-Policy: same-site | same-origin | cross-origin;

Cross-Origin-Resource-Policy: same-site
标记 same-site 的资源只能从同一站点加载。

Cross-Origin-Resource-Policy: same-origin
标记 same-origin 的资源只能从相同的来源加载。

Cross-Origin-Resource-Policy: cross-origin