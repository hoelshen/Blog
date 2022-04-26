# session 和 cookie

## cookie

Cookie 是由客户端保存的小型文本文件，其内容为一系列的键值对.Cookie是由HTTP服务器设置的，保存在浏览器中.

1. 浏览器向某个URL发起HTTP请求（可以是任何请求，比如GET一个页面、POST一个登录表单等）
2. 对应的服务器收到该HTTP请求，并计算应当返回给浏览器的HTTP响应。
3. 在响应头加入Set-Cookie字段，它的值是要设置的Cookie。
4. 浏览器收到来自服务器的HTTP响应。
5. 浏览器在响应头中发现Set-Cookie字段，就会将该字段的值保存在内存或者硬盘中。
6. 浏览器下次给该服务器发送HTTP请求时， 会将服务器设置的Cookie附加在HTTP请求的头字段Cookie中。浏览器可以存储多个域名下的Cookie，但只发送当前请求的域名曾经指定的Cookie， 这个域名也可以在Set-Cookie字段中指定）
7. 服务器收到这个HTTP请求，发现请求头中有Cookie字段， 便知道之前就和这个用户打过交道了。
8. 过期的Cookie会被浏览器删除。

服务器通过Set-Cookie响应头字段来指示浏览器保存Cookie， 浏览器通过Cookie请求头字段来告诉服务器之前的状态。 Cookie中包含若干个键值对，每个键值对可以设置过期时间。

### cookie 防篡改机制

  服务器可以为每个 cookie 项生成签名, 由于用户篡改 cookie 后无法生成对应的签名, 服务器便可以得知用户对 cookie 进行了篡改

1. 在服务器中配置一个不为人知的字符串(secret), 比如: x&sjh23;
2. 在服务器需要设置 cookie 时,比如(authed=false), 不仅设置 authed 的值为 false, 在值的后面进一步设置一个签名, 最终设置的 cookie 是 authed=false|6hTiBl7lVpd1P;
3. 签名6hTiBl7lVpd1P是这样生成的：Hash('x&sjh23'+'false')。 要设置的值与Secret相加再取哈希。
4. 用户收到HTTP响应并发现头字段Set-Cookie: authed=false|6hTiBl7lVpd1P。
5. 用户在发送HTTP请求时，篡改了authed值，设置头字段Cookie: authed=true|???。 因为用户不知道Secret，无法生成签名，只能随便填一个。
6. 服务器收到HTTP请求，发现Cookie: authed=true|???。服务器开始进行校验： Hash('true'+'x&sjh23')，便会发现用户提供的签名不正确。

因为Cookie是明文传输的， 只要服务器设置过一次authed=true|xxxx我不就知道true的签名是xxxx了么， 以后就可以用这个签名来欺骗服务器了。因此Cookie中最好不要放敏感数据。 一般来讲Cookie中只会放一个Session Id，而Session存储在服务器端。

## session

Session 是存储在服务器端的，避免了在客户端Cookie中存储敏感数据。 Session 可以存储在HTTP服务器的内存中，也可以存在内存数据库（如redis）中， 对于重量级的应用甚至可以存储在数据库中。

1. 用户提交包含用户名和密码的表单,发送 http 请求.
2. 服务器验证用户发来的用户密码.
3. 如果正确则把当前用户名存储到 redis 中,并生成它在 redis 中的 id.这个ID称为Session ID，通过Session ID可以从Redis中取出对应的用户对象， 敏感数据（比如authed=true）都存储在这个用户对象中。
4. 设置Cookie为sessionId=xxxxxx|checksum并发送HTTP响应， 仍然为每一项Cookie都设置签名。
5. 用户收到HTTP响应后，便看不到任何敏感数据了。在此后的请求中发送该Cookie给服务器。
6. 服务器收到此后的HTTP请求后，发现Cookie中有SessionID，进行防篡改验证。
7. 如果通过了验证，根据该ID从Redis中取出对应的用户对象， 查看该对象的状态并继续执行业务逻辑。

Web应用框架都会实现上述过程，在Web应用中可以直接获得当前用户。 相当于在HTTP协议之上，通过Cookie实现了持久的会话。这个会话便称为Session。

# 简单对比

1、cookie：4K，可以手动设置失效期
2、localStorage：5M，除非手动清除，否则一直存在
3、sessionStorage：5M，不可以跨标签访问，页面关闭就清理
4、indexedDB：浏览器端数据库，无限容量，除非手动清除，否则一直存在
5、service worker 实现离线缓存

SW 除了 work 线程的限制外，由于可拦截页面请求，为了保证页面安全，浏览器端对 sw 的使用限制也不少。

1）无法直接操作 DOM 对象，也无法访问 window、document、parent 对象。可以访问 location、navigator；

2）可代理的页面作用域限制。默认是 sw.js 所在文件目录及子目录的请求可代理，可在注册时手动设置作用域范围；

3）必须在 https 中使用，允许在开发调试的 localhost 使用。
