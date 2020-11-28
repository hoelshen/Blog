# 什么是node。js

1. 不一样 node。js api

2. node。js  没有浏览器API， document， window

node.js 让你用类似的方式， 控制整个计算机


## web服务 --  腾讯视频

搜索引擎优化 + 首屏速度优化  =  服务端渲染

服务端渲染 + 前后同构 = node.js

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gj9sa9292kj30ht0nc75a.jpg)

BFF 层

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gj9sjt272oj31350o9dhr.jpg)

对用户侧提供 HTTP 服务
使用后端 RPC 服务

module.exports和exports一开始都是一个空对象{}，实际上，这两个对象指向同一块内存。这也就是说module.exports和exports是等价的（前提是：不去改变它们指向的内存地址）。
例如：
exports.age = 18和module.exports.age = 18，这两种写法是一致的（都相当于给最初的空对象{}添加了一个属性，通过require得到的就是{age: 18}）。
但是：
require引入的对象本质上是module.exports。这就产生了一个问题，当 module.exports和exports指向的不是同一块内存时，exports的内容就会失效。

例如：
module.exports = {name: 'jikebang'}；
exports = {name: 'liuhua'}

webpack 给我们每个模块创建了一个函数作用域，让他们不互相干扰

```js
if(installedModules[moduleId]){
  return installedModules[moduleId].exports
}

  var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}
  }

```

node 模块加载过程

1. 加载模块: `require('<module>');`
2. 加载模块会运行模块代码
3. 模块导入支持绝对路径和相对路径, 相对路径永远是该文件对应的路径开始
4. 加载模块建议都带上后缀
5. 加载时, 有两种情况:

a. `<module>` 是路径名, 如: `./index2` , 如果没值指定后缀名, 那么会按下面顺序一次加载, 直到抛出异常 MODULE_NOT_FOUND
① `.js` 
② `.json` 
③ `.node` 
④ `<module>` 文件夹 -> `package.json` 文件 ->  `main` 字段(入口文件) -> `index.js` / `index.json` / `index.node` 

b. `<module>` 不是路径, 直接就是一个模块名称, 如: `http` 
① 先在核心模块查找, 是否有和给定名字一样的模块
② 如果核心模块没有, 那就认为是第三方模块. 
③ 找当前 js 文件所在目录找 `node_modules` 文件夹, 如果没有, 会去上一级目录找, 以此类推, 直到磁盘根目录停止查找, 若还找不到, 则抛出异常(PS: 这个查找目录顺序可以打印 `process.mainModule['paths']` 进行查看: `console.log(process.mainModule['paths']`)
④ 如果在某一级 `node_modules` 文件夹下找到相应模块, 则进行加载


EventEmiiter
  观察者模式
    addListener
    removeListener
  调用 vs 抛事件
    关键在于『不知道被通知者存在』
    以及『没有人听还能继续下去』

![EventLoop](https://tva1.sinaimg.cn/large/007S8ZIlgy1gj9wrya130j315e0n8wkg.jpg)

非阻塞I/O
I/O 即input/ouput 一个系统的输入 输出
阻塞与非阻塞的区别在于系统接收输入再到输出期间，能不能接收其他输入

异步流程控制：
  callback
  
异步流程控制:
1. callback嵌套 -> 可能会造成 callback, 代码可读性降低
2. Promise
3. Generator
4. Async/Await: Generator语法糖，本质跟Generator一致

代码解析的时候会按顺序入栈，遇到setTimeout之类的宏任务的时候会起另一个调用栈，所以setTimeout里的throw和try catch里边的interview不在同一个调用栈，可以这么理解嘛？


then 里面也是一个全新的 promise


什么是 http 服务
一个网页请求，包含两次http包交换
  浏览器向 http 服务器发送请求 http 包
  http 服务器向浏览器返回 http 包

 RPC 调用
 Remote Procedure Call（远程过程调用）

和 Ajax 有什么相同点？
  * 都是两个计算机之间的网络通信
  * 需要双方约定一个数据格式

RPC 调用过程
  寻址、负载均衡
    Ajax: 使用 DNS 进行寻址
    RPC ： 使用特有服务进行寻址
  客户端服务器通过id 进行寻址， 找到ip 在进行服务器端请求

TCP 通信方式
  单工通信  单向通信 一方只给一方发包
  半双工通信（轮番通信）  同一时间内只有一方能发包
  全双工通信  交叉的通信

二进制协议
  更小的数据包体积
  更快的编解码速率

浏览器不支持让我们直接管理tcp连接。

不过websocket可以实现类似rpc通信的效果。
但在服务端和浏览器通信的场景下，影响通信时延最严重的还是网络距离，用rpc通信换掉http api所提升的性能起不到什么明显的效果。反而开发成本也提高了，所以没必要。

另外一说，http2也是基于二进制数据帧的通信方式

http2 的 tcp 是全双工通讯 http1.1 的 tcp 是半双工通讯

半双工 => 全双工  请求带上编号

实战开发：
整体架构:

![分步架构](https://tva1.sinaimg.cn/large/007S8ZIlgy1gjb2kn86eej31600qfgoo.jpg)

模板渲染
  include 子模板：
  xss 过滤 模板 helper 函数

使用 graphQl 就相当于一个中间层node去请求接口返回数据然后用graphql封装好前端在调的时候调的就是中间层的数据


前后端同构
ReactDomServer.renderToString（）
VueServeRenderer.renderToString（）

同构的关键：
  1. 注重职责的分离  ( 1. 处理数据 2. 环境)

压力测试
  ab
  webbench


node 性能压测
  pro

javascript 代码性能优化
计算性能优化的本质
减少不必要的计算
空间换时间

node.js 进程守护
  node.js 的稳定性

1. 子进程捕获uncautht异常，并主动退出；
2. 父进程监听子进程退出事件，并延迟创建子进程；
3. 子进程监控内存占用过大，主动退出；
4. 父进程监听子进程心跳，3次没心跳，杀掉子进程；

动静分离

静态内容：
  基本不会变动， 也不会因为请求参数不同而变化
  cdn分发， http 缓存

动态内容
  各种因为请求参数不同而作变动，且变种的数量几乎不可枚举
  用大量的源机器承载，结合反向代理进行负载均衡

反向代理与缓存服务
  涉及到在 node 中配置 redis 服务

设计模式：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gjbyitvwuuj30dg09dgm1.jpg)

设计模式
单一职责
里氏替换
依赖倒转
接口隔离
最小知晓原则
开闭原则

