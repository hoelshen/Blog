1. escape 和 unescape

escape()不能直接用于URL编码，它的真正作用是返回一个字符的Unicode编码值

它的具体规则是，除了ASCII字母、数字、标点符号"@ * _ + - . /"以外，对其他所有字符进行编码。在u0000到u00ff之间的符号被转成%xx的形式，其余符号被转成%uxxxx的形式。对应的解码函数是unescape()。

还有两个点需要注意

首先，无论网页的原始编码是什么，一旦被Javascript编码，就都变为unicode字符。也就是说，Javascipt函数的输入和输出，默认都是Unicode字符。这一点对下面两个函数也适用。
其次，escape()不对"+"编码。但是我们知道，网页在提交表单的时候，如果有空格，则会被转化为+字符。服务器处理数据的时候，会把+号处理成空格。所以，使用的时候要小心。

```js
escape()编码：

const time = 2018-02-09
const tile = '63元黑糖颗粒固饮'
let url = “http://localhost:8080/index.html?time="+escape(time)+"&title="+escape(tile)
地址栏显示结果：
    “http://localhost:8080/index.html?time=2018-01-09&title=63%u5143%u9ED1%u7CD6%u9897%u7C92%u56FA%u996E"

    --------------
    unescape（）解码：

let url = “http://localhost:8080/index.html?time="+unescape(2018-01-09)+"&title="+unescape(63%u5143%u9ED1%u7CD6%u9897%u7C92%u56FA%u996E)
地址栏显示结果：
   “http://localhost:8080/index.html?time=2018-01-09&title=63元黑糖颗粒固饮"
```

2.encodeURI 和 decodeURI

encodeURI()是Javascript中真正用来对URL编码的函数。

它用于对URL的组成部分进行个别编码，除了常见的符号以外，对其他一些在网址中有特殊含义的符号"; / ? : @ & = + $ , #"，也不进行编码。编码后，它输出符号的utf-8形式，并且在每个字节前加上%。
它对应的解码函数是decodeURI()

需要注意的是，它不对单引号'编码。

```JS
let url = "http://localhost:8080/index.html?time=2018-01-09&title=63元黑糖颗粒固饮"

encodeURI（）编码：
let encodeURI_url = encodeURI(url) = "http://localhost:8080/index.html?time=2018-01-09&title=63%E5%85%83%E9%BB%91%E7%B3%96%E9%A2%97%E7%B2%92%E5%9B%BA%E9%A5%AE"

decodeURI（）解码：

decodeURI（encodeURI_url ）= “http://localhost:8080/index.html?time=2018-01-09&title=63元黑糖颗粒固饮”

```

3.encodeURIComponent 和 decodeURIComponent

与encodeURI()的区别是，它用于对整个URL进行编码。"; / ? : @ & = + $ , #"，这些在encodeURI()中不被编码的符号，在encodeURIComponent()中统统会被编码。
它对应的解码函数是decodeURIComponent()。

```JS
let url = "http://localhost:8080/index.html?time=2018-01-09&title=63元黑糖颗粒固饮"

encodeURIComponent （）编码：

let encodeURIComponent _url = encodeURIComponent (url) = http%3A%2F%2Flocalhost%3A8080%2Findex.html%3Ftime%3D2018-01-09%26title%3D63%E5%85%83%E9%BB%91%E7%B3%96%E9%A2%97%E7%B2%92%E5%9B%BA%E9%A5%AE

decodeURIComponent（）解码：

decodeURIComponent（encodeURIComponent _url ）= “http://localhost:8080/index.html?time=2018-01-09&title=63元黑糖颗粒固饮”

```

-----
different
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent>
You have three options:

escape() will not encode: @*/+

encodeURI() will not encode: ~!@#$&*()=:/,;?+'

encodeURIComponent() will not encode: ~!*()'

But in your case, if you want to pass a URL into a GET parameter of other page, you should use escape or encodeURIComponent, but not encodeURI.
