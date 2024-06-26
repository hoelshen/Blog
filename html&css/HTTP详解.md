# http 分析详解

影响一个 HTTP 网络请求的因素主要有两个: 带宽和延迟

- 带宽:

- 延迟:

- 浏览器堵塞: 浏览器会因为一些原因堵塞请求.浏览器对于同一个域名,同时只有 4 个连接.

- dns 查询:浏览器需要知道目标 ip 才能建立连接.

- 建立连接: http 是基于 tcp 协议, 浏览器最快也要在第三次握手时才能捎带 http 请求报文,达到真正的建立连接,但是这些连接无法复用会导致每次请求都经历三次握手和慢启动.

## https 和 http 区别

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gj09pjdus5j310g0j2god.jpg)

1. 安全性不同
   https 可以有效的防止运营商劫持,解决了防劫持的一个大问题.
2. 网站申请流程不同

https 协议需要到 CA 申请证书，一般免费证书很少，需要交费，Web 服务器启用 SSL 需要获得一个服务器证书并将该证书与要使用 SSL 的服务器绑定。

3. 默认端口不同

http 和 https 使用的是完全不同的连接方式，同时使用的端口也不同，http 使用的是 80 端口，https 使用的是 443 端口。在网络模型中，HTTP 工作于应用层，而 HTTPS 工作在传输层。

4. 对搜索排名的提升

这也是很多站长所关注的地方。百度和谷歌两大搜索引擎都已经明确表示，HTTPS 网站将会作为搜索排名的一个重要权重指标。也就是说 HTTPS 网站比起 HTTP 网站在搜索排名中更有优势。

HTTPS 网站相比起 HTTP 网站拥有着多种的优势，HTTP 明显已经不能适应当今这个互联网时代，可以预见到 HTTP 在不久的将来将会全面被 HTTPS 所取代。

## http

HTTP 协议也就是超文本传输协议，是一种使用明文数据传输的网络协议

## https

为了解决 HTTP 协议的这一缺陷，需要使用另一种协议：安全套接字层超文本传输协议 HTTPS，为了数据传输的安全，HTTPS 在 HTTP 的基础上加入了 SSL/TLS 协议，SSL/TLS 依靠证书来验证服务器的身份，并为浏览器和服务器之间的通信加密。HTTPS 协议可以理解为 HTTP 协议的升级，就是在 HTTP 的基础上增加了数据加密。在数据进行传输之前，对数据进行加密，然后再发送到服务器。这样，就算数据被第三者所截获，但是由于数据是加密的，所以你的个人信息仍然是安全的。这就是 HTTP 和 HTTPS 的最大区别。

![区别对比](https://tva1.sinaimg.cn/large/007S8ZIlgy1gj09qsu0hnj313y0lstc2.jpg)

## SSL/TLS 运行机制

SSL/TLS 的基本思路是公钥加密法：客户端先向服务器索要并验证公钥，然后用公钥加密传输来协商生成“对话秘钥”（非对称加密），双方采用“对话秘钥”进行加密通信（对称加密）。

通信过程如下：

1. 客户端发出请求：给出支持的协议版本、支持的加密方法（如 RSA 公钥加密）以及一个客户端生成的随机数（Client random）；

2. 服务端回应：确认双方通信的协议版本、加密方法，并给出服务器证书以及一个服务器生成的随机数（Server random）；

3. 客户端回应：客户端确认证书有效，取出证书中的公钥，然后生成一个新的随机数（Premaster secret），使用公钥加密这个随机数，发送给服务端；

4. 服务端回应：服务端使用自己的私钥解密客户端发来的随机数（Premaster secret），客户端和服务端根据约定的加密方法，使用三个随机数，生成“对话秘钥”；

5. 会话通信：客户端和服务端使用“对话秘钥”加密通信，这个过程完全使用普通的 HTTP 协议，只不过用“会话秘钥”加密内容。

---

TLS 的交换密钥的过程：

1. 客户端发送一个请求给服务器
2. 服务器生成一对非对称的公钥和私钥， 然后把公钥附加到一个 CA 数字证书上，返回给客户端。
3. 客户端校验该证书是否合法（通过浏览器内置的厂商跟证书等手段校验），然后从根证书中提取出公钥
4. 客户端生成一个随机数，然后使用公钥对这个随机数进行加密后发送给服务器；
5. 服务器利用私钥 对收到的随机数密文进行揭秘得到 key；
6. 后续客户端和服务器传输数据使用该 key 进行加密后再传输；

---

## http1.0 vs http1.1

1. 连接无法复用
   http1.0 传输数据时,每次都需要重新建立连接,增加延迟.
   http1.1 加入了 Connection: keep-alive 可复用一部分连接,但域名分片等情况下任然需要建立多个 connection, 耗费资源,给服务器带来压力.

2. head-of-line blocking(HOLB) 指一系列包(package) 因为第一个包被阻塞;当页面中需要请求很多资源的时候,holb 会导致在达到最大请求数量时,剩余资源需要等待其他请求完成后才能发起请求.
   http1.0 下一个请求必须在前一个请求返回后才能发出. 如果某个请求长时间没有返回,那么接下来的请求就全部阻塞
   http1.1 尝试使用 pipeling 来解决,即浏览器可以一次性发出多个请求（同个域名，同一条 TCP 链接）.但请求还是按顺序返回的,如果前一个请求很耗时, 即使后面的请求服务器已经处理完,仍要等待前面的请求处理完才可以按序返回.

3. 协议开销大

4. 安全因素

在 http1.1 和 http1.0 的区别

1. 缓存处理：HTTP/1.0 使用 Pragma:no-cache + Last-Modified/If-Modified-Since 来作为缓存判断的标准；HTTP/1.1 引入了更多的缓存控制策略：Cache-Control、Etag/If-None-Match 等。

2. 错误状态管理：HTTP/1.1 新增了 24 个错误状态响应码，如 409（Conflict）表示请求的资源与资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除。

3. 范围请求：HTTP/1.1 在请求头引入了 range 头域，它允许只请求资源的某个部分，即返回码是 206（Partial Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接，支持断点续传。

4. Host 头：HTTP1.0 中认为每台服务器都绑定一个唯一的 IP 地址，因此，请求消息中的 URL 并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个 IP 地址。HTTP1.1 的请求消息和响应消息都应支持 Host 头域，且请求消息中如果没有 Host 头域会报告一个错误（400 Bad Request）。有了 Host 字段，就可以将请求发往同一台服务器上的不同网站，为虚拟主机的兴起打下了基础。

5. 持久连接：HTTP/1.1 **最大的变化就是引入了持久连接（persistent connection），在 HTTP/1.1 中默认开启 Connection: keep-alive，即 TCP 连接默认不关闭，可以被多个请求复用。 因为进行 tcp 三次握手连接是很耗费时间的**

客户端和服务器发现对方一段时间没有活动，就可以主动关闭连接。不过，规范的做法是，客户端在最后一个请求时，发送 Connection: close，明确要求服务器关闭 TCP 连接。客户端和服务器发现对方一段时间没有活动，就可以主动关闭连接。不过，规范的做法是，客户端在最后一个请求时，发送 Connection: close，明确要求服务器关闭 TCP 连接。

6. 管道机制：HTTP/1.1 中引入了管道机制（pipelining）,即在同一个 TCP 连接中，客户端可以同时发送多个请求。

## http2.0

1. 二进制传输
   二进制格式传输数据,而非 http1.x 的文本格式,二进制协议解析起来更高效 将请求和响应数据分割为更小的帧,并且它们采用二进制编码

2. 多路复用 解决了浏览器限制同个域名下的请求数量的问题,同时也更容易实现全速传输
   在 http2.0 中域名下所有通信都在单个连接上完成,

采用二进制传输的原因： **单个连接可以承载任意数量的双向数据流, 数据流以消息的形式发送,而消息又由一个或多个帧组成,多个帧可以乱序发送，因为根据帧首部的流标识可以重新组装.**

- 同个域名只需要占用一个 TCP 连接，使用一个连接并行发送多个请求和响应,消除了因多个 TCP 连接而带来的延时和内存消耗。
- 并行交错地发送多个请求，请求之间互不影响。
- 并行交错地发送多个响应，响应之间互不干扰。
- 在 HTTP/2 中，每个请求都可以带一个 31bit 的优先值，0 表示最高优先级， 数值越大优先级越低。有了这个优先值，客户端和服务器就可以在处理不同的流时采取不同的策略，以最优的方式发送流、消息和帧。

![多路复用](https://tva1.sinaimg.cn/large/007S8ZIlgy1gj0omxblv1j315e0kegoe.jpg)

多路复用的技术可以只通过一个 TCP 连接就可以传输所有的请求数据。

![连接方式](https://tva1.sinaimg.cn/large/007S8ZIlgy1gj2pztlijkj30ui0u0jws.jpg)

3. Header 压缩

- http/2 在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键－值对，对于相同的数据，不再通过每次请求和响应发送；
- 首部表在 HTTP/2 的连接存续期内始终存在，由客户端和服务器共同渐进地更新;
- 每个新的首部键－值对要么被追加到当前表的末尾，要么替换表中之前的值

4. Server Push
   服务端能通过 push 的方式将客户端需要的内容预先推送出去, 也叫"cache push".

## http3.0

google 搞了一个基于 UDP 协议的 QUIC 协议,并且使用在了 HTTP/3 上, 在之前名为 HTTP-over-QUIC, QUIC 的意思是“快速 UDP Internet 连接”。协议的这种更改将极大地加快连接建立和数据传输的时间。但是，UDP 当然更快，更简单，但是它不具备 TCP 的可靠性和错误处理能力。

HTTP3 是 HTTP2 的复用和压缩功能，协议从 TCP 更改为 UDP。然后，Google 家伙在协议中添加了他们的层，以确保稳定性，数据包接收顺序以及安全性。

因此，HTTP3 在保持 QUIC 稳定性的同时使用 UDP 来保持高速，而又不会忘记 TLS 的安全性。

- 多路复用
- 加密认证的报文
- 向前纠错机制

看重点: http1.x 和 http1.0 相比 多了长连接, connection : keep-alive

http1.x 和 http2.0 多路复用: 只通过一个 tcp 可以发送多个请求,不用按照顺序--对应,避免了"队头堵塞"

HTTP/2 协议只在 HTTPS 环境下才有效，升级到 HTTP/2，必须先启用 HTTPS。

## 常见的几个问题

### 现代浏览器在与服务器建立了一个 TCP 连接后是否会在一个 HTTP 请求完成后断开？什么情况下会断开

在 HTTP/1.0 中，一个服务器在发送完一个 HTTP 响应后，会断开 TCP 链接。在 1.1 中加入 connection: keep-alive 默认开启

所以第一个问题的答案是：默认情况下建立 TCP 连接不会断开，只有在请求报头中声明 Connection: close 才会在请求完成后关闭连接

### ：一个 TCP 连接可以对应几个 HTTP 请求

了解了第一个问题之后，其实这个问题已经有了答案，如果维持连接，一个 TCP 连接是可以发送多个 HTTP 请求的。

### 第三个问题：一个 TCP 连接中 HTTP 请求发送可以一起发送么（比如一起发三个请求，再三个响应一起接收）

HTTP/1.1 存在一个问题，单个 TCP 连接在同一时刻只能处理一个请求，意思是说：两个请求的生命周期不能重叠，任意两个 HTTP 请求从开始到结束的时间在同一个 TCP 连接里不能重叠。
虽然 HTTP/1.1 规范中规定了 Pipelining 来试图解决这个问题，但是这个功能在浏览器中默认是关闭的。

但是，HTTP2 提供了 Multiplexing 多路传输特性，可以在一个 TCP 连接中同时完成多个 HTTP 请求。至于 Multiplexing 具体怎么实现的就是另一个问题了。我们可以看一下使用 HTTP2 的效果。

### 浏览器对同一 Host 建立 TCP 连接到数量有没有限制

有。Chrome 最多允许对同一个 Host 建立六个 TCP 连接。不同的浏览器有一些区别。

HTTPS 在进行数据传输之前会与网站服务器和 web 浏览器进行一次握手,在握手时确定双方的加密密码信息

1. Web 浏览器将支持的加密信息发送给网站服务器
2. 网站服务器会选择出一套加密算法和哈希算法，将验证身份的信息以证书（证书发布 CA 机构、证书有效期、公钥、证书所有者、签名等）的形式发送给 Web 浏览器
3. 当 Web 浏览器收到证书之后首先需要验证证书的合法性，如果证书受到浏览器信任则在浏览器地址栏会有标志显示，否则就会显示不受信的标识。
4. 当网站服务器接收到浏览器发送过来的数据后，会使用网站本身的私钥将信息解密确定密码，然后通过密码解密 Web 浏览器发送过来的握手信息，并验证哈希是否与 Web 浏览器一致。
5. 最后浏览器解密并计算经过哈希算法加密的握手消息，如果与服务发送过来的哈希一致，则此握手过程结束后，服务器与浏览器会使用之前浏览器生成的随机密码和对称加密算法进行加密交换数据。

![加密协议](https://tva1.sinaimg.cn/large/007S8ZIlgy1gjp0q00k4fj30vi0katcc.jpg)

HTTPS 运用了非对称加密：加密使用的密钥和解密使用的密钥是不相同的，分别称为：公钥、私钥，公钥和算法都是公开的，私钥是保密的。非对称加密算法性能较低，但是安全性超强，由于其加密特性，非对称加密算法能加密的数据长度也是有限的。
例如：RSA、DSA、ECDSA、 DH、ECDHE 等。

![HTTPS](https://tva1.sinaimg.cn/large/007S8ZIlgy1gjp0tococ5j30xm0o2wr0.jpg)

HSTS

HSTS(HTTP Strict-Transport-Security)它是一个 Web 安全策略机制,网站采用 HSTS 后，用户访问时无需手动在地址栏中输入 HTTPS，浏览器会自动采用 HTTPS 访问网站地址，从而保证用户始终访问到网站的加密链接，保护数据传输安全。

服务器需要认证的通信过程
