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

## 本地存储的几种简单对比

1、cookie：4K，可以手动设置失效期
2、localStorage：5M，除非手动清除，否则一直存在
3、sessionStorage：5M，不可以跨标签访问，页面关闭就清理
4、indexedDB：浏览器端数据库，无限容量，除非手动清除，否则一直存在
5、service worker 实现离线缓存

SW 除了 work 线程的限制外，由于可拦截页面请求，为了保证页面安全，浏览器端对 sw 的使用限制也不少。

1）无法直接操作 DOM 对象，也无法访问 window、document、parent 对象。可以访问 location、navigator；

2）可代理的页面作用域限制。默认是 sw.js 所在文件目录及子目录的请求可代理，可在注册时手动设置作用域范围；

3）必须在 https 中使用，允许在开发调试的 localhost 使用。

Max-Age

Max-Age 可以为正数、负数、甚至是 0。

如果 max-Age 属性为正数时，浏览器会将其持久化，即写到对应的 Cookie 文件中。

当 max-Age 为 0 时，则会立即删除这个 Cookie。

假如 Expires 和 Max-Age 都存在，Max-Age 优先级更高。

Expires

当 Expires 缺省时，表示的是会话 cookie，像上图expires 的值为session， 表示的就是会话性 cookie， 当会话性cookie的时候， 值保存在客户端内存中， 并在关闭浏览器时失效，
与会话性 Cookie 相对的是持久性 Cookie，持久性 Cookies 会保存在用户的硬盘中，直至过期或者清除 Cookie。这里值得注意的是，设定的日期和时间只与客户端相关，而不是服务端。

Domain

Domain 指定了 Cookie 可以送达的主机名。假如没有指定，那么默认值为当前文档访问地址中的主机部分（但是不包含子域名）。

像淘宝首页设置的 Domain 就是 .taobao.com，这样无论是 a.taobao.com 还是 b.taobao.com 都可以使用 Cookie。
在这里注意的是，不能跨域设置 Cookie，比如阿里域名下的页面把 Domain 设置成百度是无效的：

Set-Cookie: qwerty=219ffwef9w0f; Domain=baidu.com; Path=/; Expires=Wed, 30 Aug 2020 00:00:00 GMT

Secure属性

标记为 Secure 的 Cookie 只应通过被HTTPS协议加密过的请求发送给服务端。使用 HTTPS 安全协议，可以保护 Cookie 在浏览器和 Web 服务器间的传输过程中不被窃取和篡改。

HTTPOnly

设置 HTTPOnly 属性可以防止客户端脚本通过 document.cookie 等方式访问 Cookie，有助于避免 XSS 攻击。

SameSite
SameSite 属性可以让 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）。
SameSite 可以有下面三种值：

Strict 仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致。
Lax 允许部分第三方请求携带 Cookie
None 无论是否跨站都会发送 Cookie

之前默认是 None 的，Chrome80 后默认是 Lax。

1.HTTP 接口不支持 SameSite=none

如果你想加 SameSite=none 属性，那么该 Cookie 就必须同时加上 Secure 属性，表示只有在 HTTPS 协议下该 Cookie 才会被发送。

2. 需要 UA 检测，部分浏览器不能加 SameSite=none

Window.sessionStorage
sessionStorage 属性允许你访问一个，对应当前源的 session Storage 对象。它与 localStorage 相似，不同之处在于 localStorage 里面存储的数据没有过期时间设置，而存储在 sessionStorage 里面的数据在页面会话结束时会被清除。

页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话。
在新标签或窗口打开一个页面时会复制顶级浏览会话的上下文作为新会话的上下文，这点和 session cookies 的运行方式不同。
打开多个相同的 URL 的 Tabs 页面，会创建各自的 sessionStorage。
关闭对应浏览器标签或窗口，会清除对应的 sessionStorage。
