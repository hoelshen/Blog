# 跨域的 N 种实现方式

## 什么是跨域

跨域， 为什么需要跨域？跨域有什么不好？怎么实现跨域？

跨域， 为什么需要跨域？跨域有什么不好？怎么实现跨域？ 一、什么是跨域 只要协议、域名、端口有任何一个不同，都被当作是不同的域，之间的请求就是跨域操作
二、跨域会有什么问题？ 防止CSRF攻击： 同源策略   隔离潜在恶意文件的重要安全机制 补充知识，什么是CSRF攻击？ CSRF（Cross-site request forgery跨站请求伪造，也被称为“One Click Attack”或者Session Riding，通常缩写为CSRF或者XSRF，是一种对网站的恶意利用。尽管听起来像跨站脚本（XSS），但它与XSS非常不同，并且攻击方式几乎相左。XSS利用站点内的信任用户，而CSRF则通过伪装来自受信任用户的请求来利用受信任的网站。与XSS攻击相比，CSRF攻击往往不大流行（因此对其进行防范的资源也相当稀少）和难以防范，所以被认为比XSS更具危险性。
为什么会出现CSRF攻击？举例说明 比如说有两个网站A和B。你是A网站的管理员，你在A网站有一个权限是删除用户，比如说这个过程只需用你的身份登陆并且POST数据到http://a.com/delUser，就可以实现删除操作。好现在说B网站，B网站被攻击了，别人种下了恶意代码，你点开的时候就会模拟跨域请求，如果是针对你，那么就可以模拟对A站的跨域请求，恰好这个时候你已经在A站登陆了。那么攻击者在B站内通过脚本，模拟一个用户删除操作是很简单的。面对这种问题，有从浏览器解决，但个人认为最好是从网站端解决，检测每次POST过来数据时热refer，添加accesstoken等都是好方法。
三、怎么实现跨域访问？ 1 document.domain + iframe 基于iframe实现的跨域要求两个域具有aa.xx.com,bb.xx.com这种特点，也就是两个页面必须属于一个基础域（例如都是xxx.com，或是xxx.com.cn），使用同一协议（例如都是 http）和同一端口（例如都是80），这样在两个页面中同时添加document.domain，就可以实现父页面调用子页面的函数，代码如下： 页面一在head内添加js如下： document.domain = “xx.com”; function aa(){ alert(“p”); } body添加iframe和js如下 iframe src=”http://localhost:8080/CmsUI/2.html“ id=”i”
document.getElementById(‘i’).onload = function(){ var d = document.getElementById(‘i’).contentWindow; d.a(); };
页面二 head添加如下 document.domain = “xx.com”; function a(){ alert(“c”); }
这时候父页面就可以调用子页面的a函数，实现js跨域访问
2 Jsonp 利用script标签没有跨域限制的“漏洞”（历史遗迹啊）来达到与第三方通讯的目的。当需要通讯时，本站脚本创建一个script元素，地址指向第三方的API网址，形如：script src=”http://www.example.net/api?param1=1&param2=2"></script 并提供一个回调函数来接收数据（函数名可约定，或通过地址参数传递）。 第三方产生的响应为json数据的包装（故称之为jsonp，即json padding），形如： callback({“name”:”hax”,”gender”:”Male”}) 这样浏览器会调用callback函数，并传递解析后json对象作为参数。本站脚本可在callback函数里处理所传入的数据。
过程屡一下 ① 首先我这边客户端有人请求其他网页的内容 ② 本站通过script 指向对方的API网址，然后提供一个数据接收的回调函数 ③ 第三方产生后的数据 json并进行包装 jsonp json padding 调用我们的回调函数 解析数据
JSONP的优点是：它不像XMLHttpRequest对象实现的Ajax请求那样受到同源策略的限制；它的兼容性更好，在更加古老的浏览器中都可以运行，不需要XMLHttpRequest或ActiveX的支持；并且在请求完毕后可以通过调用callback的方式回传结果。 缺点：它只支持GET请求而不支持POST等其它类型的HTTP请求；它只支持跨域HTTP请求这种情况，不能解决不同域的两个页面之间如何进行JavaScript调用的问题。
3 web代理 即用户访问A网站时所产生的对B网站的跨域访问请求均提交到A网站的指定页面（Post页面过去），由该页面代替用户页面完成交互，从而返回合适的结果。此方案可以解决现阶段所能够想到的多数跨域访问问题，但要求A网站提供Web代理的支持，因此A网站与B网站之间必须是紧密协作的，且每次交互过程，A网站的服务器负担增加，且无法代用户保存session状态。
4 跨域资源共享CORS CORS（Cross-Origin Resource Sharing）跨域资源共享，定义了必须在访问跨域资源时，浏览器与服务器应该如何沟通。CORS背后的基本思想就是使用自定义的HTTP头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功还是失败。 script type=”text/javascript” var xhr = new XMLHttpRequest(); xhr.open(“GET”, “/trigkit4”,true); xhr.send(); /script 以上的trigkit4是相对路径，如果我们要使用CORS，相关Ajax代码可能如下所示： script type=”text/javascript”> var xhr = new XMLHttpRequest(); xhr.open(“GET”, “http://segmentfault.com/u/trigkit4/",true); xhr.send(); /script> 代码与之前的区别就在于相对路径换成了其他域的绝对路径，也就是你要跨域访问的接口地址。
服务器端对于CORS的支持，主要就是通过设置Access-Control-Allow-Origin来进行的。如果浏览器检测到相应的设置，就可以允许Ajax进行跨域的访问。
CORS与JSONP相比，无疑更为先进、方便和可靠。 ① JSONP只能实现GET请求，而CORS支持所有类型的HTTP请求。 ② 使用CORS，开发者可以使用普通的XMLHttpRequest发起请求和获得数据，比起JSONP有更好的错误处理。 ③ JSONP主要被老的浏览器支持，它们往往不支持CORS，而绝大多数现代浏览器都已经支持了CORS）。


