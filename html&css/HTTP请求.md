# HTTP

## 请求

* ＜request-line＞(请求消息行)
* ＜headers＞(请求消息头)
* ＜blank line＞(空行)
* ＜request-body＞(请求消息数据)

content-type 是请求消息头中的一个请求参数, 标识请求消息数据的格式.

## 响应

HTTP 消息头允许客户端和服务器通过 request和 response传递附加信息。

* ＜status-line＞(状态行)
* ＜headers＞(消息报头)
* ＜blank line＞(空行)
* ＜response-body＞(响应正文)
content-type是响应消息报头中的一个参数，标识响应正文数据的格式

根据不同上下文, 可将消息头分为:

* 同时适用于请求和响应消息，但与最终消息主体中传输的数据无关的消息头。
* 包含更多有关要获取的资源或客户端本身信息的消息头。
* 包含有关响应的补充信息，如其位置或服务器本身（名称和版本等）的消息头。
* 包含有关实体主体的更多信息，比如主体长(Content-Length)度或其MIME类型。

根据代理对其的处理方式分为:
    端到端消息头

    逐跳消息头
    
    这类消息头包括 connection keep-alive  proxy-authenticate, proxy-authorization, te,trailer, transfer-encoding 及 upgrade
