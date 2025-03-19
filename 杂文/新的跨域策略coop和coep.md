# COOP 和 COEP - 新的跨域策略

## 背景介绍

浏览器天然支持一些安全策略(同源策略)，但是同源策略也有一些例外，任何网站都可以不受限制地加载下面的资源：

- 嵌入跨域 iframe
- image、script 等资源
- 使用 DOM 打开跨域弹出窗口

---

## COOP: Cross Origin Opener Policy（跨源开放者政策）

COOP 通过切断跨源窗口之间的引用来提供更强的隔离性。

例如，如果带有 COOP 的网站打开一个新的跨域弹出页面，则其 `window.opener` 属性将为 `null`。

### 语法

```http
Cross-Origin-Opener-Policy: same-origin | same-origin-allow-popups | unsafe-none
```

---

## CORP: Cross Origin Resource Policy（跨源资源策略）

CORP 允许网站防止其资源被其他源加载。

### 语法

```http
Cross-Origin-Resource-Policy: same-site | same-origin | cross-origin
```

### 取值说明

- **`same-site`**: 标记 same-site 的资源只能从同一站点加载。
- **`same-origin`**: 标记 same-origin 的资源只能从相同的来源加载。
- **`cross-origin`**: 允许任何网站加载资源。

---

## CORS: Cross-Origin Resource Sharing（跨源资源共享）

### HTTP 响应首部字段

#### Access-Control-Allow-Origin

响应首部中可以携带一个 Access-Control-Allow-Origin 字段，其语法如下:

```http
Access-Control-Allow-Origin: <origin> | *
```

其中，origin 参数的值指定了允许访问该资源的外域 URI。对于不需要携带身份凭证的请求，服务器可以指定该字段的值为通配符，表示允许来自所有域的请求。

例如，下面的字段值将允许来自 http://mozilla.com 的请求：

```http
Access-Control-Allow-Origin: http://mozilla.com
```

如果服务端指定了具体的域名而非"`*`"，那么响应首部中的 `Vary` 字段的值必须包含 `Origin`。这将告诉客户端：服务器对不同的源站返回不同的内容。

#### Access-Control-Expose-Headers

Access-Control-Expose-Headers 头让服务器把允许浏览器访问的头放入白名单，例如：

```http
Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header
```

这样浏览器就能够通过 `getResponseHeader` 访问 `X-My-Custom-Header` 和 `X-Another-Custom-Header` 响应头了。

#### Access-Control-Max-Age

Access-Control-Max-Age 头指定了 preflight 请求的结果能够被缓存多久。

```http
Access-Control-Max-Age: <delta-seconds>
```

delta-seconds 参数表示 preflight 请求的结果在多少秒内有效。

#### Access-Control-Allow-Credentials

Access-Control-Allow-Credentials 头指定了当浏览器的 credentials 设置为 true 时是否允许浏览器读取 response 的内容。当用在对 preflight 预检测请求的响应中时，它指定了实际的请求是否可以使用 credentials。

请注意：简单 GET 请求不会被预检；如果对此类请求的响应中不包含该字段，这个响应将被忽略掉，并且浏览器也不会将相应内容返回给网页。

```http
Access-Control-Allow-Credentials: true
```

#### Access-Control-Allow-Methods

```http
Access-Control-Allow-Methods: <method>[, <method>]*
```

### HTTP 请求首部字段

#### Origin

```http
Origin: <origin>
```

#### Access-Control-Request-Method

```http
Access-Control-Request-Method: <method>
```

#### Access-Control-Request-Headers

```http
Access-Control-Request-Headers: <field-name>[, <field-name>]*
```
