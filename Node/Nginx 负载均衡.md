负载均衡的几种常用方式

1、轮询（默认）
每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。

upstream backserver {
    server 192.168.0.14;
    server 192.168.0.15;
}
2、weight
指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的
情况。

upstream backserver {
    server 192.168.0.14 weight=3;
    server 192.168.0.15 weight=7;
}
权重越高，在被访问的概率越大，如上例，分别是30%，70%。

3. ip_hash

upstream backserver {
    ip_hash;
    server 192.168.0.14:88;
    server 192.168.0.15:80;
}
在负载均衡系统中，假如用户在某台服务器上登录了，那么该用户第二次请求的时候，因为我们是负载均衡系统，每次请求都会重新定位到服务器集群中的某一个，那么已经登录某一个服务器的用户再重新定位到另一个服务器，其登录信息将会丢失，这样显然是不妥的。
我们可以采用ip_hash指令解决这个问题，如果客户已经访问了某个服务器，当用户再次访问时，会将该请求通过哈希算法，自动定位到该服务器。
每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题。

4. fair (第三方)
upstream backserver {
    server server1;
    server server2;
    fair;
}

5. url_ash

按访问url的hash结果来分配请求，使每个url定向到同一个（对应的）后端服务器，后端服务器为缓存时比较有效。

upstream backserver {
    server squid1:3128;
    server squid2:3128;
    hash $request_uri;
    hash_method crc32;
}

max_fails ：允许请求失败的次数默认为1.当超过最大次数时，返回proxy_next_upstream 模块定义的错误

fail_timeout:max_fails次失败后，暂停的时间

```shell
#user  nobody;

worker_processes  4;
events {
# 最大并发数
worker_connections  1024;
}
http{
    # 待选服务器列表
    upstream myproject{
        # ip_hash指令，将同一用户引入同一服务器。
        ip_hash;
        server 125.219.42.4 fail_timeout=60s;
        server 172.31.2.183;
    }

    server{
        # 监听端口
        listen 80;
        # 根目录下
        location / {
        # 选择哪个服务器列表
            proxy_pass http://myproject;
        }

    }
}




```

6.down
标识某一台server不可用。可能能通过某些参数动态的激活它吧，要不真没啥用。

```sh
upstream tomcats {
    server 192.168.0.100:8080 weight=2 max_fails=3 fail_timeout=15;

    server 192.168.0.101:8080 down;

    server 192.168.0.102:8080 backup;
}
```
