# 跨域的 N 种实现方式

## 什么是跨域
跨域， 为什么需要跨域？跨域有什么不好？怎么实现跨域？

 一、什么是跨域 只要协议、域名、端口有任何一个不同，都被当作是不同的域，之间的请求就是跨域操作.
## 跨域会有什么问题？


xSS 可以分为多种类型，但是总体上我认为分为两类：持久型和非持久型
持久型也就是攻击的代码被服务端写入进数据库中，这种攻击危害性很大，因为如果网站访问量很大的话，就会导致大量正常访问页面的用户都受到攻击。



csp
建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行。
两种方式开启csp
1. 设置 HTTP Header 中的 Content-Security-Policy
2. 设置 meta 标签的方式 <meta http-equiv="Content-Security-Policy">


Content-Security-Policy: default-src ‘self’
Content-Security-Policy: img-src https://*
Content-Security-Policy: child-src 'none'

csrf 跨站请求伪造

防范 CSRF 攻击可以遵循以下几种规则：
1. Get 请求不对数据进行修改
2. 不让第三方网站访问到用户 Cookie
3. 阻止第三方网站请求接口
4. 请求时附带验证信息，比如验证码或者 Token
 防止CSRF攻击： 同源策略   隔离潜在恶意文件的重要安全机制 补充知识，什么是CSRF攻击？ CSRF（Cross-site request forgery跨站请求伪造，也被称为“One Click Attack”或者Session Riding，通常缩写为CSRF或者XSRF，是一种对网站的恶意利用。尽管听起来像跨站脚本（XSS），但它与XSS非常不同，并且攻击方式几乎相左。XSS利用站点内的信任用户，而CSRF则通过伪装来自受信任用户的请求来利用受信任的网站。与XSS攻击相比，CSRF攻击往往不大流行（因此对其进行防范的资源也相当稀少）和难以防范，所以被认为比XSS更具危险性。
为什么会出现CSRF攻击？举例说明 比如说有两个网站A和B。你是A网站的管理员，你在A网站有一个权限是删除用户，比如说这个过程只需用你的身份登陆并且POST数据到http://a.com/delUser，就可以实现删除操作。好现在说B网站，B网站被攻击了，别人种下了恶意代码，你点开的时候就会模拟跨域请求，如果是针对你，那么就可以模拟对A站的跨域请求，恰好这个时候你已经在A站登陆了。那么攻击者在B站内通过脚本，模拟一个用户删除操作是很简单的。面对这种问题，有从浏览器解决，但个人认为最好是从网站端解决，检测每次POST过来数据时热refer，添加accesstoken等都是好方法。



## 怎么实现跨域访问？
 1 document.domain + iframe 基于iframe实现的跨域要求两个域具有aa.xx.com,bb.xx.com这种特点，也就是两个页面必须属于一个基础域（例如都是xxx.com，或是xxx.com.cn），使用同一协议（例如都是 http）和同一端口（例如都是80），这样在两个页面中同时添加document.domain，就可以实现父页面调用子页面的函数，代码如下： 页面一在head内添加js如下： document.domain = “xx.com”; function aa(){ alert(“p”); } body添加iframe和js如下 iframe src=”http://localhost:8080/CmsUI/2.html“ id=”i”
document.getElementById(‘i’).onload = function(){ var d = document.getElementById(‘i’).contentWindow; d.a(); };



页面二 head添加如下 document.domain = “xx.com”; function a(){ alert(“c”); }
这时候父页面就可以调用子页面的a函数，实现js跨域访问

编写一个函数来自动创建 iframe 跨域



2 Jsonp

jsonp如何实现
JavaScript是一种在Web开发中经常使用的前端动态脚本技术。在JavaScript中，有一个很重要的安全性限制，被称为“Same-Origin Policy”（同源策略）。这一策略对于JavaScript代码能够访问的页面内容做了很重要的限制，即JavaScript只能访问与包含它的文档在同一域下的内容。 

JavaScript这个安全策略在进行多iframe或多窗口编程、以及Ajax编程时显得尤为重要。根据这个策略，在baidu.com下的页面中包含的JavaScript代码，不能访问在google.com域名下的页面内容；甚至不同的子域名之间的页面也不能通过JavaScript代码互相访问。对于Ajax的影响在于，通过XMLHttpRequest实现的Ajax请求，不能向不同的域提交请求，例如，在abc.example.com下的页面，不能向def.example.com提交Ajax请求，等等。 

然而，当进行一些比较深入的前端编程的时候，不可避免地需要进行跨域操作，这时候“同源策略”就显得过于苛刻。JSONP跨域GET请求是一个常用的解决方案，下面我们来看一下JSONP跨域是如何实现的，并且探讨下JSONP跨域的原理。 

利用在页面中创建<script>节点的方法向不同域提交HTTP请求的方法称为JSONP，这项技术可以解决跨域提交Ajax请求的问题。JSONP的工作原理如下所述： 

假设在http://example1.com/index.php这个页面中向http://example2.com/getinfo.php提交GET请求，我们可以将下面的JavaScript代码放在http://example1.com/index.php这个页面中来实现： 
复制代码
代码如下:

var eleScript= document.createElement("script"); 
eleScript.type = "text/javascript"; 
eleScript.src = "http://example2.com/getinfo.php"; 
document.getElementsByTagName("HEAD")[0].appendChild(eleScript); 

当GET请求从http://example2.com/getinfo.php返回时，可以返回一段JavaScript代码，这段代码会自动执行，可以用来负责调用http://example1.com/index.php页面中的一个callback函数。 

JSONP的优点是：它不像XMLHttpRequest对象实现的Ajax请求那样受到同源策略的限制；它的兼容性更好，在更加古老的浏览器中都可以运行，不需要XMLHttpRequest或ActiveX的支持；并且在请求完毕后可以通过调用callback的方式回传结果。 

JSONP的缺点则是：它只支持GET请求而不支持POST等其它类型的HTTP请求；它只支持跨域HTTP请求这种情况，不能解决不同域的两个页面之间如何进行JavaScript调用的问题。 
再来一个例子： 
复制代码
代码如下:

var qsData = {'searchWord':$("#searchWord").attr("value"),'currentUserId': 
$("#currentUserId").attr("value"),'conditionBean.pageSize':$("#pageSize").attr("value")}; 
$.ajax({ 
async:false, 
url: http://跨域的dns/document!searchJSONResult.action, 
type: "GET", 
dataType: 'jsonp', 
jsonp: 'jsoncallback', 
data: qsData, 
timeout: 5000, 
beforeSend: function(){ 
//jsonp 方式此方法不被触发.原因可能是dataType如果指定为jsonp的话,就已经不是ajax事件了 
}, 
success: function (json) {//客户端jquery预先定义好的callback函数,成功获取跨域服务器上的json数据后,会动态执行这个callback函数 
if(json.actionErrors.length!=0){ 
alert(json.actionErrors); 
} 
genDynamicContent(qsData,type,json); 
}, 
complete: function(XMLHttpRequest, textStatus){ 
$.unblockUI({ fadeOut: 10 }); 
}, 
error: function(xhr){ 
//jsonp 方式此方法不被触发.原因可能是dataType如果指定为jsonp的话,就已经不是ajax事件了 
//请求出错处理 
alert("请求出错(请检查相关度网络状况.)"); 
} 
}); 
有时也会看到这样的写法： 
$.getJSON("http://跨域的dns/document!searchJSONResult.action?name1="+value1+"&jsoncallback=?", 
function(json){ 
if(json.属性名==值){ 
// 执行代码 
} 
}); 

这种方式其实是上例$.ajax({..}) api的一种高级封装，有些$.ajax api底层的参数就被封装而不可见了。 
这样，jquery就会拼装成如下的url get请求： 
复制代码
代码如下:

http://跨域的dns/document!searchJSONResult.action?&jsoncallback=jsonp1236827957501&_=1236828192549&searchWord= 
%E7%94%A8%E4%BE%8B¤tUserId=5351&conditionBean.pageSize=15 

在响应端(http://跨域的dns/document!searchJSONResult.action)，通过 jsoncallback = request.getParameter("jsoncallback") 得到jquery端随后要回调的js function name:jsonp1236827957501 然后 response的内容为一个Script Tags:"jsonp1236827957501("+按请求参数生成的json数组+")"; jquery就会通过回调方法动态加载调用这个js tag:jsonp1236827957501(json数组); 这样就达到了跨域数据交换的目的。 

JSONP原理 
JSONP的最基本的原理是：动态添加一个<script>标签，而script标签的src属性是没有跨域的限制的。这样说来，这种跨域方式其实与ajax XmlHttpRequest协议无关了。 
这样其实"jQuery AJAX跨域问题"就成了个伪命题，jquery $.ajax方法名有误导人之嫌。 
如果设为dataType: 'jsonp'，这个$.ajax方法就和ajax XmlHttpRequest没什么关系了，取而代之的则是JSONP协议。JSONP是一个非官方的协议，它允许在服务器端集成Script tags返回至客户端，通过javascript callback的形式实现跨域访问。 

JSONP即JSON with Padding。由于同源策略的限制，XmlHttpRequest只允许请求当前源（域名、协议、端口）的资源。如果要进行跨域请求， 我们可以通过使用html的script标记来进行跨域请求，并在响应中返回要执行的script代码，其中可以直接使用JSON传递javascript对象。 这种跨域的通讯方式称为JSONP。 

jsonCallback 函数jsonp1236827957501(....)：是浏览器客户端注册的，获取跨域服务器上的json数据后，回调的函数 

Jsonp的执行过程如下： 
首先在客户端注册一个callback (如:'jsoncallback'), 然后把callback的名字(如:jsonp1236827957501)传给服务器。注意：服务端得到callback的数值后，要用jsonp1236827957501(......)把将要输出的json内容包括起来，此时，服务器生成 json 数据才能被客户端正确接收。 

然后以 javascript 语法的方式，生成一个function， function 名字就是传递上来的参数 'jsoncallback'的值 jsonp1236827957501 . 
最后将 json 数据直接以入参的方式，放置到 function 中，这样就生成了一段 js 语法的文档，返回给客户端。 

客户端浏览器，解析script标签，并执行返回的 javascript 文档，此时javascript文档数据，作为参数， 传入到了客户端预先定义好的 callback 函数(如上例中jquery $.ajax()方法封装的的success: function (json))里。 
可以说jsonp的方式原理上和<script src="http://跨域/...xx.js"></script>是一致的(qq空间就是大量采用这种方式来实现跨域数据交换的)。JSONP是一种脚本注入(Script Injection)行为，所以有一定的安全隐患。 
那jquery为什么不支持post方式跨域呢？ 

虽然采用post+动态生成iframe是可以达到post跨域的目的(有位js牛人就是这样把jquery1.2.5 打patch的)，但这样做是一个比较极端的方式，不建议采用。 
也可以说get方式的跨域是合法的，post方式从安全角度上，被认为是不合法的，万不得已还是不要剑走偏锋。 

client端跨域访问的需求看来也引起w3c的注意了，看资料说html5 WebSocket标准支持跨域的数据交换，应该也是一个将来可选的跨域数据交换的解决方案。 

来个超简单的例子： 
代码如下:

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" > 
<head> 
<title>Test Jsonp</title> 
<script type="text/javascript"> 
function jsonpCallback(result) 
{ 
alert(result.msg); 
} 
</script> 
<script type="text/javascript" src="http://crossdomain.com/jsonServerResponse?jsonp=jsonpCallback"></script> 
</head> 
<body> 
</body> 
</html> 

其中 jsonCallback 是客户端注册的，获取跨域服务器上的json数据后，回调的函数。http://crossdomain.com/jsonServerResponse?jsonp=jsonpCallback 这个 url 是跨域服务器取 json 数据的接口，参数为回调函数的名字，返回的格式为：jsonpCallback({msg:'this is json data'}) 

简述原理与过程：首先在客户端注册一个callback, 然后把callback的名字传给服务器。此时，服务器先生成 json 数据。 然后以 javascript 语法的方式，生成一个function , function 名字就是传递上来的参数 jsonp。最后将 json 数据直接以入参的方式，放置到 function 中，这样就生成了一段 js 语法的文档，返回给客户端。 

客户端浏览器，解析script标签，并执行返回的 javascript 文档，此时数据作为参数，传入到了客户端预先定义好的 callback 函数里。（动态执行回调函数）

 利用script标签没有跨域限制的“漏洞”（历史遗迹啊）来达到与第三方通讯的目的。当需要通讯时，本站脚本创建一个script元素，地址指向第三方的API网址，形如：script src=”http://www.example.net/api?param1=1&param2=2"></script 并提供一个回调函数来接收数据（函数名可约定，或通过地址参数传递）。 第三方产生的响应为json数据的包装（故称之为jsonp，即json padding），形如： callback({“name”:”hax”,”gender”:”Male”}) 这样浏览器会调用callback函数，并传递解析后json对象作为参数。本站脚本可在callback函数里处理所传入的数据。
过程屡一下 ① 首先我这边客户端有人请求其他网页的内容 ② 本站通过script 指向对方的API网址，然后提供一个数据接收的回调函数 ③ 第三方产生后的数据 json并进行包装 jsonp json padding 调用我们的回调函数 解析数据
JSONP的优点是：它不像XMLHttpRequest对象实现的Ajax请求那样受到同源策略的限制；它的兼容性更好，在更加古老的浏览器中都可以运行，不需要XMLHttpRequest或ActiveX的支持；并且在请求完毕后可以通过调用callback的方式回传结果。 缺点：它只支持GET请求而不支持POST等其它类型的HTTP请求；它只支持跨域HTTP请求这种情况，不能解决不同域的两个页面之间如何进行JavaScript调用的问题。
3. web代理 即用户访问A网站时所产生的对B网站的跨域访问请求均提交到A网站的指定页面（Post页面过去），由该页面代替用户页面完成交互，从而返回合适的结果。此方案可以解决现阶段所能够想到的多数跨域访问问题，但要求A网站提供Web代理的支持，因此A网站与B网站之间必须是紧密协作的，且每次交互过程，A网站的服务器负担增加，且无法代用户保存session状态。
4. 跨域资源共享CORS   CORS（Cross-Origin Resource Sharing）跨域资源共享，定义了必须在访问跨域资源时，浏览器与服务器应该如何沟通。CORS背后的基本思想就是使用自定义的HTTP头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功还是失败。 script type=”text/javascript” var xhr = new XMLHttpRequest(); xhr.open(“GET”, “/trigkit4”,true); xhr.send(); /script 以上的trigkit4是相对路径，如果我们要使用CORS，相关Ajax代码可能如下所示： script type=”text/javascript”> var xhr = new XMLHttpRequest(); xhr.open(“GET”, “http://segmentfault.com/u/trigkit4/",true); xhr.send(); /script> 代码与之前的区别就在于相对路径换成了其他域的绝对路径，也就是你要跨域访问的接口地址。
服务器端对于CORS的支持，主要就是通过设置Access-Control-Allow-Origin来进行的。如果浏览器检测到相应的设置，就可以允许Ajax进行跨域的访问。
CORS与JSONP相比，无疑更为先进、方便和可靠。 ① JSONP只能实现GET请求，而CORS支持所有类型的HTTP请求。 ② 使用CORS，开发者可以使用普通的XMLHttpRequest发起请求和获得数据，比起JSONP有更好的错误处理。 ③ JSONP主要被老的浏览器支持，它们往往不支持CORS，而绝大多数现代浏览器都已经支持了CORS）。

token保存在runtime
token保存在localstorage 启动到销毁的运行状态 xss攻击
token保存在cookie里面 增加http-only



![vue配置跨域](http://pvt7l4h05.bkt.clouddn.com/2019-08-19-Pasted%20Graphic%2026.png)
仔细理解一下：
local开发环境时配置服务器ip，在config里面设置。
还有一点this复制给data时无效的，使用箭头函数可以解决。
![vue配置跨域2](http://pvt7l4h05.bkt.clouddn.com/2019-08-19-Pasted%20Graphic%2027.png)
生产环境还需要 服务器配置cros跨域，access-control-allow-origin:*

