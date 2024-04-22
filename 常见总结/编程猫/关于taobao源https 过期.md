# 关于 taobao 源 https 过期

## 问题由来

一天在开发途中出现 jekines 部署异常，查看 log 发现，关于 taobao 的源 访问 https 都找不到了。

```
https://registry.npm.taobao.org
```

替换成

```
https://registry.npmmirror.com
```

## 问题
