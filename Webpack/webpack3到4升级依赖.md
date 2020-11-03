# 升级详情


## babel

babel 相关的依赖都移动到一个位置了: @babel/core  @babel/preset-env @babel/preset-env

## 相关依赖升级


## mode 配置

1. 生产环境默认开启了很多代码优化( minify, splite 等)
2. 自动设置 process_env_node_env 到不同环境, 也就是不需要 definePlugin 来做这个设置.

## 不在支持的依赖

* file-loader 替换成 url-loader
* commonschunkplugin  该用 optimization_splitchunks 进行模块划分
* extract-text-webpack  改用 mini-css-extract-plugin 替换
* aggressiveMergingPlugin
